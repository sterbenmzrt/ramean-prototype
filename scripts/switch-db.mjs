// Mengganti provider datasource Prisma ke PostgreSQL ketika DB_PROVIDER=postgresql.
// Dipakai di build Vercel (set DB_PROVIDER=postgresql di env Vercel) agar produksi
// memakai Supabase Postgres, sementara lokal tetap SQLite (tanpa env ini = no-op).
//
// Perubahan hanya pada file schema di mesin build (ephemeral), tidak perlu di-commit.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

if (process.env.DB_PROVIDER !== "postgresql") {
  console.log("[switch-db] DB_PROVIDER bukan 'postgresql' → schema dibiarkan (SQLite).");
  process.exit(0);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here, "..", "prisma", "schema.prisma");
const original = readFileSync(schemaPath, "utf8");

const postgres = `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}`;

const next = original.replace(/datasource db \{[\s\S]*?\}/, postgres);
if (next === original) {
  console.warn("[switch-db] blok 'datasource db' tidak ditemukan — tidak ada perubahan.");
} else {
  writeFileSync(schemaPath, next);
  console.log("[switch-db] datasource → postgresql (DATABASE_URL + DIRECT_URL).");
}
