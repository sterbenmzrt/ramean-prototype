import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMyTransactions } from "@/lib/data";
import Tag from "@/components/ui/Tag";
import { fmt } from "@/lib/tokens";

export const dynamic = "force-dynamic";

const TYPE_LABEL = { PAYMENT: "Pembayaran", TOPUP: "Top-up", REFUND: "Refund" };
const TYPE_VARIANT = { PAYMENT: "primary", TOPUP: "yellow", REFUND: "green" };
const STATUS_LABEL = { SUCCESS: "Berhasil", HELD: "Ditahan (escrow)", PENDING: "Menunggu", REFUNDED: "Direfund" };

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function RiwayatPage() {
  const session = await getServerSession(authOptions);
  const txns = await getMyTransactions(session.user.id);

  return (
    <div>
      <div className="text-[11px] font-semibold text-text-sm tracking-[0.07em] uppercase font-body mb-1">
        Akun
      </div>
      <h1 className="font-heading font-bold text-[22px] text-text mb-6">Riwayat Transaksi</h1>

      {txns.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-10 text-center">
          <p className="text-sm text-text-md font-body">Belum ada transaksi.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl divide-y divide-border-lt">
          {txns.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-4 px-5 py-4 max-md:flex-col max-md:items-start"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-text font-body">{t.label}</span>
                  <Tag variant={TYPE_VARIANT[t.type] || "primary"}>
                    {TYPE_LABEL[t.type] || t.type}
                  </Tag>
                </div>
                <div className="text-[12px] text-text-sm font-body mt-1">
                  {formatDate(t.createdAt)} · {STATUS_LABEL[t.status] || t.status}
                </div>
              </div>
              <div className="font-heading font-bold text-sm text-text whitespace-nowrap">
                {fmt(t.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
