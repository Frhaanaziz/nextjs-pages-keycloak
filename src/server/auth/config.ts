import { env } from "@/env";
import { type NextAuthOptions } from "next-auth";
import { logoutRequest, refreshTokenRequest } from "./oidc";
import type { Account, AuthOptions, User } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";
import { ProviderType } from "next-auth/providers/index";

type UserType = {
  id: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      data: UserType;
    };
    accessToken?: string; // testing
  }

  interface User {
    data: UserType;
  }

  interface Profile {
    picture?: string;
    given_name?: string;
    family_name?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: { data: UserType };
    accessToken?: string; // testing
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
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
} satisfies NextAuthOptions;
