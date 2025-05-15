import { env } from "@/env";
import { logoutRequest, refreshTokenRequest } from "@/server/auth/oidc";
import { type NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { encrypt, normalizeEthereumAddress } from "../utils";

type UserType = {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
};

// Declare custom types for NextAuth modules
declare module "next-auth" {
  interface Session {
    user: UserType;
    error?: "RefreshTokenError";
    access_token: string;
    id_token: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    walletAddress?: string;
  }

  interface Account {
    id_token: string;
  }

  interface Profile {
    wallet_address?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_at: number;
    error?: "RefreshTokenError";
    user: UserType;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    // Configure the Keycloak provider
    KeycloakProvider({
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_CLIENT_SECRET,
      issuer: env.KEYCLOAK_ISSUER,
    }),
  ],
  events: {
    async signOut({ token }) {
      await logoutRequest(token.refresh_token);
    },
  },
  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Handle JWT token creation and refreshing
      if (account && profile) {
        if (
          !account.access_token ||
          !account.refresh_token ||
          !account.expires_at
        ) {
          console.error("Missing account information, Account:", account);
          throw new TypeError("Missing account information");
        }

        // Update token with account information
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.id_token = account.id_token;
        token.expires_at = Date.now() + (account.expires_at - 15) * 1000; // 15 seconds before expiration
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          walletAddress: normalizeEthereumAddress(profile.wallet_address),
        };

        return token;
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError("Missing refresh_token");

        try {
          // Send a post request to refresh the token
          const { data } = await refreshTokenRequest(token.refresh_token);

          // Update token with refreshed information
          return {
            ...token,
            access_token: data.access_token,
            expires_at: Math.floor(Date.now() / 1000 + data.expires_in),
            refresh_token: data.refresh_token,
            id_token: data.id_token,
          };
        } catch (e: any) {
          console.error("Error refreshing access_token", e.response.data);
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = "RefreshTokenError";
          return token;
        }
      }
    },
    // Handle session information
    async session({ session, token }) {
      session.user = token.user;
      session.error = token.error;
      session.access_token = encrypt(token.access_token);
      session.id_token = encrypt(token.id_token);
      return session;
    },
  },
} satisfies NextAuthOptions;
