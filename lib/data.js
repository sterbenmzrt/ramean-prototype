import { prisma } from "./prisma";

// Pemetaan kategori DB -> label tampilan + nilai filter marketplace.
export const CATEGORY_LABEL = {
  STREAMING: "Streaming",
  ENTERTAINMENT: "Streaming",
  AI_TOOLS: "AI Tools",
  PRODUCTIVITY: "Produktivitas",
};

export const FILTER_CATEGORIES = ["Semua", "Streaming", "AI Tools", "Produktivitas"];

// Layanan yang ditandai "Terlaris" (mirror badge prototype).
const HOT = new Set(["YouTube Premium", "ChatGPT Plus"]);

function discountPct(orig, price) {
  if (!orig || orig <= 0) return 0;
  return Math.round(((orig - price) / orig) * 100);
}

// View-model satu layanan untuk marketplace/landing.
function toServiceCard(service) {
  const groups = service.groups || [];
  const availGroups = groups.filter(
    (g) => g.status === "AVAILABLE" && g.filledSlots < g.totalSlots
  );
  // Harga patungan = pricePerSlot termurah dari grup tersedia (fallback grup mana pun).
  const priceSource = availGroups.length ? availGroups : groups;
  const price = priceSource.length
    ? Math.min(...priceSource.map((g) => g.pricePerSlot))
    : 0;
  const slotsLeft = availGroups.reduce(
    (sum, g) => sum + (g.totalSlots - g.filledSlots),
    0
  );
  return {
    id: service.id,
    name: service.name,
    category: service.category,
    categoryLabel: CATEGORY_LABEL[service.category] || service.category,
    logoUrl: service.logoUrl,
    description: service.description,
    originalPrice: service.originalPrice,
    price,
    discount: discountPct(service.originalPrice, price),
    slotsLeft,
    available: availGroups.length > 0,
    hot: HOT.has(service.name),
  };
}

export async function getServiceCards() {
  const services = await prisma.service.findMany({
    include: { groups: true },
    orderBy: { name: "asc" },
  });
  return services.map(toServiceCard);
}

// Detail satu layanan + grup-grupnya (dengan anggota untuk tampilan anonim).
export async function getServiceDetail(id) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      groups: {
        include: { members: { include: { user: { select: { name: true } } } } },
        orderBy: { renewalDate: "asc" },
      },
    },
  });
  if (!service) return null;
  const card = toServiceCard(service);
  const groups = service.groups.map((g) => ({
    id: g.id,
    status: g.status,
    totalSlots: g.totalSlots,
    filledSlots: g.filledSlots,
    pricePerSlot: g.pricePerSlot,
    renewalDate: g.renewalDate,
    rules: g.rules,
    hostName: g.hostName,
    members: g.members.map((m) => m.user.name),
  }));
  return { ...card, slots: card.slotsLeft, groups, raw: service };
}

export async function getGroupForCheckout(groupId) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { service: true },
  });
  if (!group) return null;
  return group;
}

export async function getGroupLobby(groupId) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      service: true,
      members: { include: { user: { select: { id: true, name: true } } } },
    },
  });
  return group;
}
