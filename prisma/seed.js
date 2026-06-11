// Seed Ramean MVP — layanan populer + grup dummy + user demo.
// Jalankan: npm run db:seed  (atau otomatis lewat `prisma migrate reset`).
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// logoUrl menunjuk ke /public/assets. Layanan tanpa aset (Spotify) memakai "" —
// UI akan fallback ke inisial berwarna (anti broken-image, lihat DoD).
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
    name: "Spotify Premium",
    category: "ENTERTAINMENT",
    logoUrl: "",
    originalPrice: 55000,
    pricePerSlot: 14000,
    totalSlots: 6,
    description:
      "Dengarkan musik tanpa iklan, kualitas tinggi, dan bisa diunduh untuk didengar offline.",
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

const MEMBER_NAMES = [
  "Andi Rivaldo",
  "Siti Maharani",
  "Kevin Wijaya",
  "Desi Ayu",
  "Raihan Nugraha",
  "Bella Kusuma",
  "Hendra Saputra",
  "Nina Pratiwi",
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

  // User dummy untuk mengisi anggota grup (tanpa password / tidak bisa login).
  const members = [];
  for (let i = 0; i < MEMBER_NAMES.length; i++) {
    const name = MEMBER_NAMES[i];
    const m = await prisma.user.create({
      data: { name, email: `member${i + 1}@dummy.ramean.id` },
    });
    members.push(m);
  }

  const renewal = monthsFromNow(1);

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

    // Grup tersedia (mengumpulkan) — 2 anggota terisi.
    const seatMembers = members.slice(0, 2);
    const availGroup = await prisma.group.create({
      data: {
        serviceId: service.id,
        hostName: "Ramean Official",
        totalSlots: svc.totalSlots,
        filledSlots: seatMembers.length,
        pricePerSlot: svc.pricePerSlot,
        renewalDate: renewal,
        status: "AVAILABLE",
        rules:
          "Satu slot untuk satu pengguna. Dilarang mengubah password akun atau menambah perangkat di luar slotmu.",
      },
    });
    for (const m of seatMembers) {
      await prisma.groupMember.create({
        data: { groupId: availGroup.id, userId: m.id, paymentStatus: "PAID", role: "MEMBER" },
      });
      await prisma.subscription.create({
        data: {
          userId: m.id,
          groupId: availGroup.id,
          status: "ACTIVE",
          autoRenewal: true,
          nextBillingDate: renewal,
        },
      });
    }

    // ChatGPT Plus: tambah satu grup PENUH untuk menguji edge case "grup penuh".
    if (svc.name === "ChatGPT Plus") {
      const fullMembers = members.slice(0, svc.totalSlots);
      const fullGroup = await prisma.group.create({
        data: {
          serviceId: service.id,
          hostName: "Ramean Official",
          totalSlots: svc.totalSlots,
          filledSlots: svc.totalSlots,
          pricePerSlot: svc.pricePerSlot,
          renewalDate: renewal,
          status: "FULL",
          rules: "Grup ini sudah penuh.",
        },
      });
      for (const m of fullMembers) {
        await prisma.groupMember.create({
          data: { groupId: fullGroup.id, userId: m.id, paymentStatus: "PAID", role: "MEMBER" },
        });
        await prisma.subscription.create({
          data: {
            userId: m.id,
            groupId: fullGroup.id,
            status: "ACTIVE",
            autoRenewal: true,
            nextBillingDate: renewal,
          },
        });
      }
    }
  }

  const counts = {
    users: await prisma.user.count(),
    services: await prisma.service.count(),
    groups: await prisma.group.count(),
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
