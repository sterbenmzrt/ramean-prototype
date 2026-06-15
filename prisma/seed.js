// Seed Ramean MVP — layanan populer + grup dummy + user demo.
// Jalankan: npm run db:seed  (atau otomatis lewat `prisma migrate reset`).
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// Baca gambar banner dari public/assets/banners (di-commit → ikut ter-deploy ke prod).
// Bila folder kosong, kembalikan [] → seed pakai banner fallback gradient.
const BANNER_DIR = path.join(__dirname, "..", "public", "assets", "banners");
const IMG_RE = /\.(jpe?g|png|webp)$/i;

function readBannerFiles() {
  try {
    return fs.readdirSync(BANNER_DIR).filter((f) => IMG_RE.test(f)).sort();
  } catch {
    return [];
  }
}

const PROMO_TITLES = [
  "Hemat sampai 70% untuk langganan favoritmu",
  "Dana aman dengan escrow Ramean",
  "Patungan praktis tanpa ribet",
  "Akses layanan premium harga bersahabat",
  "Satu platform untuk semua langgananmu",
  "Gabung grup, langsung pakai hari ini",
];

// logoUrl menunjuk ke /public/assets. Layanan tanpa aset memakai "" — UI akan
// fallback ke inisial berwarna (anti broken-image, lihat DoD).
const SERVICES = [
  {
    name: "Netflix",
    category: "STREAMING",
    logoUrl: "/assets/netflix-logo.svg",
    originalPrice: 54000,
    pricePerSlot: 15000,
    totalSlots: 6,
    description:
      "Nikmati ribuan film, series, dan dokumenter premium dari seluruh dunia kapan saja.",
  },
  {
    name: "YouTube Premium",
    category: "STREAMING",
    logoUrl: "/assets/youtube-logo.svg",
    originalPrice: 39000,
    pricePerSlot: 8000,
    totalSlots: 6,
    description:
      "Tonton YouTube tanpa gangguan iklan, simpan video offline, dan nikmati YouTube Music.",
  },
  {
    name: "ChatGPT Plus",
    category: "AI_TOOLS",
    logoUrl: "/assets/chatgpt-logo.svg",
    originalPrice: 284000,
    pricePerSlot: 20000,
    totalSlots: 4,
    description:
      "Akses GPT-4o, DALL-E 3, browsing web real-time, dan semua fitur eksklusif ChatGPT Plus.",
  },
  {
    name: "Gemini Advanced",
    category: "AI_TOOLS",
    logoUrl: "/assets/gemini-logo.svg",
    originalPrice: 169000,
    pricePerSlot: 18000,
    totalSlots: 5,
    description:
      "Gunakan Gemini Ultra, AI paling canggih dari Google, disertai 1TB Google Drive.",
  },
  {
    name: "Canva Pro",
    category: "PRODUCTIVITY",
    logoUrl: "/assets/canva-logo.svg",
    originalPrice: 85000,
    pricePerSlot: 12000,
    totalSlots: 5,
    description:
      "Akses 100M+ elemen premium, template eksklusif, brand kit, dan fitur AI terdepan.",
  },
];

function monthsFromNow(n) {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d;
}

async function main() {
  // Bersihkan (urut hormati foreign key).
  await prisma.transaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.group.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash("password123", 10);

  // User demo (happy path) — saldo cukup.
  await prisma.user.create({
    data: {
      name: "Ahmad Rivaldhi",
      email: "demo@ramean.id",
      passwordHash: pw,
      wallet: { create: { balance: 50000 } },
    },
  });

  // User saldo tipis (untuk uji edge case "saldo kurang" di FASE 2).
  await prisma.user.create({
    data: {
      name: "Budi Hemat",
      email: "hemat@ramean.id",
      passwordHash: pw,
      wallet: { create: { balance: 5000 } },
    },
  });

  // User admin (akses panel /admin).
  await prisma.user.create({
    data: {
      name: "Admin Ramean",
      email: "admin@ramean.id",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      wallet: { create: { balance: 0 } },
    },
  });

  const renewal = monthsFromNow(1);

  // Grup dibuat kosong (tanpa anggota seed) — slot siap diisi via alur join.
  for (const svc of SERVICES) {
    const service = await prisma.service.create({
      data: {
        name: svc.name,
        category: svc.category,
        logoUrl: svc.logoUrl,
        originalPrice: svc.originalPrice,
        description: svc.description,
      },
    });

    await prisma.group.create({
      data: {
        serviceId: service.id,
        hostName: "Ramean Official",
        totalSlots: svc.totalSlots,
        filledSlots: 0,
        pricePerSlot: svc.pricePerSlot,
        renewalDate: renewal,
        status: "AVAILABLE",
        rules:
          "Satu slot untuk satu pengguna. Dilarang mengubah password akun atau menambah perangkat di luar slotmu.",
      },
    });
  }

  // Banner promo: pakai gambar di public/uploads/banners bila ada (lokal),
  // selain itu fallback gradient + judul (imagePath "") agar prod/CI tetap berisi.
  const bannerFiles = readBannerFiles();
  if (bannerFiles.length > 0) {
    await prisma.banner.createMany({
      data: bannerFiles.map((file, i) => ({
        title: PROMO_TITLES[i % PROMO_TITLES.length],
        ctaLabel: "Lihat Layanan",
        ctaHref: "/marketplace",
        order: i,
        active: true,
        imagePath: `/assets/banners/${file}`,
      })),
    });
  } else {
    await prisma.banner.createMany({
      data: [
        {
          title: "Hemat sampai 70% untuk langganan favoritmu",
          subtitle:
            "Gabung grup patungan Netflix, ChatGPT Plus, dan lainnya — bayar cukup bagianmu.",
          ctaLabel: "Lihat Layanan",
          ctaHref: "/marketplace",
          order: 0,
          active: true,
          imagePath: "",
        },
        {
          title: "Dana aman dengan escrow Ramean",
          subtitle:
            "Pembayaranmu ditahan sampai akses akun terverifikasi. Bebas dari penipuan.",
          ctaLabel: "Mulai Gratis",
          ctaHref: "/register",
          order: 1,
          active: true,
          imagePath: "",
        },
      ],
    });
  }

  const counts = {
    users: await prisma.user.count(),
    services: await prisma.service.count(),
    groups: await prisma.group.count(),
    banners: await prisma.banner.count(),
  };
  console.log("Seed selesai:", counts);
  console.log("Login demo: demo@ramean.id / password123 (saldo Rp50.000)");
  console.log("Login saldo tipis: hemat@ramean.id / password123 (saldo Rp5.000)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
