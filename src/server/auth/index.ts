import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authConfig } from "./config";
import { decrypt } from "../utils";

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authConfig);
};

export async function getAccessToken() {
  const session = await getServerSession(authConfig);
  if (session) {
    const accessTokenDecrypted = decrypt(session.access_token);
    return accessTokenDecrypted;
  }
  return null;
}

export async function getIdToken() {
  const session = await getServerSession(authConfig);
  if (session) {
    const idTokenDecrypted = decrypt(session.id_token);
    return idTokenDecrypted;
  }
  return null;
}
