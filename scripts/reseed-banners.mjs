// Reseed HANYA tabel Banner dari file di public/assets/banners — TIDAK menyentuh
// user/service/group/transaksi (beda dengan prisma/seed.js yang mereset semua).
// Aman dijalankan ke produksi untuk menyegarkan banner tanpa menghapus data lain.
//
// Pakai (produksi Supabase):
//   DB_PROVIDER=postgresql node scripts/switch-db.mjs
//   npx prisma generate
//   node --env-file=.env.production.local scripts/reseed-banners.mjs
//   git checkout prisma/schema.prisma && npx prisma generate   (balik ke SQLite)
import { PrismaClient } from "@prisma/client";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const BANNER_DIR = path.join(here, "..", "public", "assets", "banners");
const IMG_RE = /\.(jpe?g|png|webp)$/i;

const PROMO_TITLES = [
  "Hemat sampai 70% untuk langganan favoritmu",
  "Dana aman dengan escrow Ramean",
  "Patungan praktis tanpa ribet",
  "Akses layanan premium harga bersahabat",
  "Satu platform untuk semua langgananmu",
  "Gabung grup, langsung pakai hari ini",
];

function readBannerFiles() {
  try {
    return readdirSync(BANNER_DIR).filter((f) => IMG_RE.test(f)).sort();
  } catch {
    return [];
  }
}

const prisma = new PrismaClient();

async function main() {
  const before = await prisma.banner.findMany({
    orderBy: { order: "asc" },
    select: { imagePath: true, active: true, title: true },
  });
  console.log(`BEFORE: ${before.length} banner`);
  before.forEach((b) =>
    console.log(`  - ${b.imagePath || "(kosong→fallback)"} | active=${b.active} | ${b.title}`)
  );

  const files = readBannerFiles();
  if (files.length === 0) {
    console.log("Tidak ada file banner ditemukan — dibatalkan (tidak menghapus apa pun).");
    return;
  }

  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: files.map((file, i) => ({
      title: PROMO_TITLES[i % PROMO_TITLES.length],
      ctaLabel: "Lihat Layanan",
      ctaHref: "/marketplace",
      order: i,
      active: true,
      imagePath: `/assets/banners/${file}`,
    })),
  });

  const after = await prisma.banner.findMany({
    orderBy: { order: "asc" },
    select: { imagePath: true, active: true },
  });
  console.log(`AFTER: ${after.length} banner`);
  after.forEach((b) => console.log(`  + ${b.imagePath} | active=${b.active}`));
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
