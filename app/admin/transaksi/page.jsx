import Link from "next/link";
import { getAdminTransactions } from "@/lib/admin";
import Tag from "@/components/ui/Tag";
import { fmt } from "@/lib/tokens";
import TxnActions from "@/components/admin/TxnActions";

export const dynamic = "force-dynamic";

const TYPE_LABEL = { PAYMENT: "Pembayaran", TOPUP: "Top-up", REFUND: "Refund" };
const STATUS_VARIANT = { SUCCESS: "green", HELD: "yellow", PENDING: "warn" };
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

      <div className="bg-white border border-border rounded-xl divide-y divide-border-lt">
        {txns.length === 0 ? (
          <div className="p-8 text-center text-text-md font-body text-sm">Tidak ada transaksi.</div>
        ) : (
          txns.map((t) => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-3.5 max-md:flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-text font-body">{label(t)}</span>
                  <Tag variant={t.type === "REFUND" ? "primary" : "green"}>{TYPE_LABEL[t.type] || t.type}</Tag>
                  <Tag variant={STATUS_VARIANT[t.status] || "primary"}>{t.status}</Tag>
                </div>
                <div className="text-xs text-text-md font-body mt-0.5">
                  {t.user.name} · {t.user.email} · {formatDate(t.createdAt)}
                </div>
              </div>
              <div className="font-heading font-bold text-sm text-text whitespace-nowrap">{fmt(t.amount)}</div>
              <TxnActions id={t.id} type={t.type} status={t.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
