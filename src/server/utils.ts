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

export function extractEthereumAddress(did?: string) {
  if (!did) return;

  // Validasi awal: apakah string sesuai pola umum
  const regex = /^eip155:\d+:(0x[a-fA-F0-9]{40})$/;

  const match = did.match(regex);
  if (match) {
    return match[1]; // group ke-1 adalah alamat Ethereum (0x...)
  } else {
    console.error("Invalid DID format:", did);
    return; // atau bisa throw error jika ingin
  }
}
