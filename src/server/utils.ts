import { env } from "@/env";
import Cryptr from "cryptr";

export function encrypt(text: string) {
  const cryptr = new Cryptr(env.NEXTAUTH_SECRET);

  const encryptedString = cryptr.encrypt(text);
  return encryptedString;
}

export function decrypt(encryptedString: string) {
  const cryptr = new Cryptr(env.NEXTAUTH_SECRET);

  const text = cryptr.decrypt(encryptedString);
  return text;
}
