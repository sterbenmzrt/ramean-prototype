import Link from "next/link";
import { getAdminTransactions } from "@/lib/admin";
import Tag from "@/components/ui/Tag";
import { fmt } from "@/lib/tokens";
import TxnActions from "@/components/admin/TxnActions";
import DataTable, { Td } from "@/components/admin/DataTable";

export const dynamic = "force-dynamic";

const COLUMNS = [
  { key: "label", label: "Transaksi" },
  { key: "user", label: "User" },
  { key: "date", label: "Tanggal" },
  { key: "type", label: "Tipe" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Jumlah", align: "right" },
  { key: "action", label: "", align: "right" },
];

const TYPE_LABEL = { PAYMENT: "Pembayaran", TOPUP: "Top-up", REFUND: "Refund" };
const STATUS_VARIANT = { SUCCESS: "green", HELD: "yellow", PENDING: "warn", REFUNDED: "muted" };
const FILTERS = ["ALL", "HELD", "SUCCESS", "PENDING"];

function label(t) {
  return t.subscription
    ? `${t.subscription.group.service.name} — Grup ${t.subscription.group.id.slice(-4).toUpperCase()}`
    : TYPE_LABEL[t.type] || "Transaksi";
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminTransaksiPage({ searchParams }) {
  const status = searchParams?.status || "ALL";
  const txns = await getAdminTransactions(status);
  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-4">Transaksi</h1>

      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={`/admin/transaksi?status=${f}`}
            className={`px-4 min-h-[40px] inline-flex items-center rounded-lg text-[13px] font-body border no-underline ${
              status === f ? "bg-primary text-white border-primary" : "bg-white text-text-md border-border"
            }`}
          >
            {f === "ALL" ? "Semua" : f}
          </Link>
        ))}
      </div>

      <DataTable
        columns={COLUMNS}
        rows={txns}
        empty="Tidak ada transaksi."
        renderRow={(t) => (
          <tr key={t.id}>
            <Td className="font-semibold whitespace-nowrap">{label(t)}</Td>
            <Td>
              <div className="text-sm text-text">{t.user.name}</div>
              <div className="text-xs text-text-md">{t.user.email}</div>
            </Td>
            <Td className="whitespace-nowrap text-text-md text-[13px]">{formatDate(t.createdAt)}</Td>
            <Td>
              <Tag variant={t.type === "REFUND" ? "primary" : "green"}>{TYPE_LABEL[t.type] || t.type}</Tag>
            </Td>
            <Td>
              <Tag variant={STATUS_VARIANT[t.status] || "primary"}>{t.status}</Tag>
            </Td>
            <Td align="right" className="font-heading font-bold whitespace-nowrap">{fmt(t.amount)}</Td>
            <Td align="right">
              <div className="flex justify-end">
                <TxnActions id={t.id} type={t.type} status={t.status} />
              </div>
            </Td>
          </tr>
        )}
      />
    </div>
  );
}
