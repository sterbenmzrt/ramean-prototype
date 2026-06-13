import { prisma } from "@/lib/prisma";
import { encryptJSON, decryptJSON } from "@/lib/crypto";

// Simpan/perbarui kredensial akun grup (terenkripsi). Satu record per grup.
export async function setGroupCredential(groupId, { email, password, note = "" }) {
  const { ciphertext, iv, authTag } = encryptJSON({ email, password, note });
  await prisma.groupCredential.upsert({
    where: { groupId },
    create: { groupId, ciphertext, iv, authTag },
    update: { ciphertext, iv, authTag, keyVersion: 1 },
  });
}

// Untuk admin: status saja, TANPA plaintext (write-only di UI admin).
export async function getCredentialMeta(groupId) {
  const c = await prisma.groupCredential.findUnique({
    where: { groupId },
    select: { updatedAt: true },
  });
  return { exists: Boolean(c), updatedAt: c?.updatedAt ?? null };
}

// Untuk anggota di lobby: dekripsi HANYA bila pemanggil benar-benar anggota PAID.
// Mengembalikan state machine + credential (hanya saat "ready").
export async function getGroupCredentialForMember(groupId, userId) {
  const member = await prisma.groupMember.findUnique({
    where: { groupId_userId: { groupId, userId } },
    select: { paymentStatus: true },
  });
  if (!member) return { state: "not_member", credential: null };
  if (member.paymentStatus !== "PAID") return { state: "pending", credential: null };

  const c = await prisma.groupCredential.findUnique({ where: { groupId } });
  if (!c) return { state: "not_ready", credential: null };

  try {
    const credential = decryptJSON(c);
    return { state: "ready", credential };
  } catch (e) {
    console.error("Gagal dekripsi kredensial grup", groupId, e.message);
    return { state: "unavailable", credential: null };
  }
}
