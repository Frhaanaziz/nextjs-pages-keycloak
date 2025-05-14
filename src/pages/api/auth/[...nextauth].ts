import { authConfig } from "@/server/auth/config";
import NextAuth from "next-auth";

export default NextAuth(authConfig);
