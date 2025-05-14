import { env } from "@/env";
import axios from "axios";

const params = {
  client_id: env.KEYCLOAK_CLIENT_ID,
  client_secret: env.KEYCLOAK_CLIENT_SECRET,
  grant_type: "refresh_token",
};

export const oidcApi = axios.create({
  baseURL: `${env.KEYCLOAK_ISSUER}/protocol/openid-connect`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  withCredentials: true,
});

export const refreshTokenRequest = (refresh_token: string) => {
  return oidcApi({
    method: "POST",
    url: "/token",
    data: new URLSearchParams({
      refresh_token,
      ...params,
    }),
  });
};

export const logoutRequest = (refresh_token: string) => {
  return oidcApi({
    method: "POST",
    url: "/logout",
    data: new URLSearchParams({
      refresh_token,
      ...params,
    }),
  });
};
