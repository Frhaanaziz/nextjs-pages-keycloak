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

export function normalizeEthereumAddress(input?: string) {
  if (!input) return;

  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  const didRegex = /^eip155:\d+:(0x[a-fA-F0-9]{40})$/;

  if (ethAddressRegex.test(input)) {
    // Sudah berbentuk address Ethereum
    return input;
  }

  const match = input.match(didRegex);
  if (match) {
    return match[1]; // Ambil address dari DID
  }

  return; // Tidak valid
}
