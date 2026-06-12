import crypto from "node:crypto";

// Enkripsi simetris untuk kredensial akun bersama (reversibel, beda dari bcrypt yang
// satu arah untuk password login). AES-256-GCM = authenticated encryption.

const ALGO = "aes-256-gcm";

function getKey() {
  const b64 = process.env.CREDENTIAL_ENC_KEY;
  if (!b64) throw new Error("CREDENTIAL_ENC_KEY belum diset.");
  const key = Buffer.from(b64, "base64");
  if (key.length !== 32) throw new Error("CREDENTIAL_ENC_KEY harus 32 byte (base64).");
  return key;
}

// obj -> { ciphertext, iv, authTag } (Buffer, siap disimpan ke kolom Bytes Prisma).
export function encryptJSON(obj) {
  const iv = crypto.randomBytes(12); // IV unik tiap enkripsi
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(obj), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { ciphertext, iv, authTag };
}

// { ciphertext, iv, authTag } -> obj. Melempar bila authTag tidak cocok (tampering)
// atau key salah.
export function decryptJSON({ ciphertext, iv, authTag }) {
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(iv));
  decipher.setAuthTag(Buffer.from(authTag));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(ciphertext)), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8"));
}
