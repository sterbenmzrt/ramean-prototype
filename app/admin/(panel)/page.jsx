import Link from "next/link";
import { getAdminStats, getAdminTransactions, getRecentTransactions } from "@/lib/admin";
import { fmt } from "@/lib/tokens";
import Tag from "@/components/ui/Tag";
import TxnActions from "@/components/admin/TxnActions";
import StatCard from "@/components/admin/StatCard";
import DataTable, { Td } from "@/components/admin/DataTable";
import { UsersIcon, LayersIcon, TrendingUpIcon, LockIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

const TYPE_LABEL = { PAYMENT: "Pembayaran", TOPUP: "Top-up", REFUND: "Refund" };
const STATUS_VARIANT = { SUCCESS: "green", HELD: "yellow", PENDING: "warn", REFUNDED: "muted" };

function label(t) {
  return t.subscription
    ? `${t.subscription.group.service.name} — Grup ${t.subscription.group.id.slice(-4).toUpperCase()}`
    : TYPE_LABEL[t.type] || "Transaksi";
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const ACTION_COLUMNS = [
  { key: "label", label: "Transaksi" },
  { key: "user", label: "User" },
  { key: "date", label: "Tanggal" },
  { key: "amount", label: "Jumlah", align: "right" },
  { key: "action", label: "", align: "right" },
];

const RECENT_COLUMNS = [
  { key: "label", label: "Transaksi" },
  { key: "user", label: "User" },
  { key: "type", label: "Tipe" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Jumlah", align: "right" },
];

export default async function AdminDashboard() {
  const [stats, held, recent] = await Promise.all([
    getAdminStats(),
    getAdminTransactions("HELD"),
    getRecentTransactions(8),
  ]);

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-6">Dashboard</h1>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-4 mb-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <StatCard label="Total user" value={stats.totalUsers} icon={<UsersIcon />} />
        <StatCard label="Grup aktif" value={stats.activeGroups} icon={<LayersIcon />} />
        <StatCard label="GMV (pembayaran sukses)" value={fmt(stats.gmv)} icon={<TrendingUpIcon />} />
        <StatCard label="Dana escrow ditahan" value={fmt(stats.escrowHeld)} icon={<LockIcon width={18} height={18} />} />
      </div>

      {/* Butuh aksi */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-heading font-bold text-lg text-text">Butuh Aksi</h2>
          {held.length > 0 && <Tag variant="yellow">{held.length} ditahan</Tag>}
        </div>
        <DataTable
          columns={ACTION_COLUMNS}
          rows={held}
          empty="Tidak ada transaksi yang perlu aksi."
          renderRow={(t) => (
            <tr key={t.id}>
              <Td className="font-semibold whitespace-nowrap">{label(t)}</Td>
              <Td>
                <div className="text-sm text-text">{t.user.name}</div>
                <div className="text-xs text-text-md">{t.user.email}</div>
              </Td>
              <Td className="whitespace-nowrap text-text-md text-[13px]">{formatDate(t.createdAt)}</Td>
              <Td align="right" className="font-heading font-bold whitespace-nowrap">{fmt(t.amount)}</Td>
              <Td align="right">
                <div className="flex justify-end">
                  <TxnActions id={t.id} type={t.type} status={t.status} />
                </div>
              </Td>
            </tr>
          )}
        />
      </section>

      {/* Aktivitas terbaru */}
      <section>
        <div className="flex items-center justify-between mb-3 gap-4">
          <h2 className="font-heading font-bold text-lg text-text">Aktivitas Terbaru</h2>
          <Link href="/admin/transaksi" className="text-[13px] text-primary font-semibold no-underline">
            Lihat semua
          </Link>
        </div>
        <DataTable
          columns={RECENT_COLUMNS}
          rows={recent}
          empty="Belum ada transaksi."
          renderRow={(t) => (
            <tr key={t.id}>
              <Td className="font-semibold whitespace-nowrap">{label(t)}</Td>
              <Td className="text-text-md text-[13px]">{t.user.name}</Td>
              <Td>
                <Tag variant={t.type === "REFUND" ? "primary" : "green"}>{TYPE_LABEL[t.type] || t.type}</Tag>
              </Td>
              <Td>
                <Tag variant={STATUS_VARIANT[t.status] || "primary"}>{t.status}</Tag>
              </Td>
              <Td align="right" className="font-heading font-bold whitespace-nowrap">{fmt(t.amount)}</Td>
            </tr>
          )}
        />
      </section>
    </div>
  );
}
