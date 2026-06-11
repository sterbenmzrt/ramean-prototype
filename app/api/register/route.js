import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || "Data tidak valid";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email sudah terdaftar. Silakan masuk." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Buat User + Wallet (saldo awal demo agar mock-payment "Saldo Ramean" bisa jalan).
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      wallet: { create: { balance: 50000 } },
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
