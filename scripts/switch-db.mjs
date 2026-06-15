// Mengganti provider datasource Prisma ke PostgreSQL untuk produksi (mis. Vercel),
// sementara lokal tetap SQLite. Pemicunya: DATABASE_URL berupa Postgres ATAU
// DB_PROVIDER=postgresql. Lokal (DATABASE_URL `file:` / kosong) = no-op.
//
// Dijalankan di `postinstall` (pasti jalan saat `npm install` di Vercel) sehingga
// tidak bergantung pada buildCommand. Perubahan schema bersifat ephemeral di mesin
// build, tidak perlu di-commit.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dbUrl = process.env.DATABASE_URL || "";
const isPostgresUrl = /^postgres(ql)?:\/\//i.test(dbUrl);
const wantPostgres = process.env.DB_PROVIDER === "postgresql" || isPostgresUrl;

if (!wantPostgres) {
  console.log("[switch-db] DATABASE_URL bukan Postgres → schema dibiarkan (SQLite).");
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
