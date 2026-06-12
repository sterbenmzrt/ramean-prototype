import Link from "next/link";
import { notFound } from "next/navigation";
import { getGroupDetail } from "@/lib/admin";
import SvcIcon from "@/components/ui/SvcIcon";
import Tag from "@/components/ui/Tag";
import Btn from "@/components/ui/Btn";
import DataTable, { Td } from "@/components/admin/DataTable";
import TxnActions from "@/components/admin/TxnActions";
import RemoveMemberButton from "@/components/admin/RemoveMemberButton";
import DeleteGroupButton from "@/components/admin/DeleteGroupButton";
import { fmt } from "@/lib/tokens";

export const dynamic = "force-dynamic";

const GROUP_STATUS_VARIANT = { AVAILABLE: "green", FULL: "primary", INACTIVE: "warn" };
const PAY_VARIANT = { PAID: "green", PENDING: "yellow" };
const TYPE_LABEL = { PAYMENT: "Pembayaran", TOPUP: "Top-up", REFUND: "Refund" };
const TXN_STATUS_VARIANT = { SUCCESS: "green", HELD: "yellow", PENDING: "warn" };

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

const MEMBER_COLUMNS = [
  { key: "member", label: "Anggota" },
  { key: "pay", label: "Status bayar" },
  { key: "action", label: "", align: "right" },
];

const TXN_COLUMNS = [
  { key: "type", label: "Tipe" },
  { key: "user", label: "User" },
  { key: "date", label: "Tanggal" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Jumlah", align: "right" },
];

export default async function GroupCockpitPage({ params }) {
  const data = await getGroupDetail(params.id);
  if (!data) notFound();
  const { group, transactions, paymentByUser, deletable } = data;
  const svc = group.service;

  return (
    <div>
      <Link
        href="/admin/group"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-md font-body no-underline mb-4 hover:text-text"
      >
        ← Kembali ke daftar grup
      </Link>

      {/* Header */}
      <div className="bg-white border border-border rounded-xl p-6 mb-7">
        <div className="flex items-start gap-4 max-md:flex-col">
          <SvcIcon name={svc.name} logoUrl={svc.logoUrl} size={48} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-heading font-bold text-[22px] text-text">
                {svc.name} — Grup {group.id.slice(-4).toUpperCase()}
              </h1>
              <Tag variant={GROUP_STATUS_VARIANT[group.status] || "primary"}>{group.status}</Tag>
            </div>
            <div className="text-[13px] text-text-md font-body mt-1.5">
              Host: {group.hostName} · {fmt(group.pricePerSlot)}/slot · {group.filledSlots}/{group.totalSlots} slot terisi · Renewal {formatDate(group.renewalDate)}
            </div>
            {group.rules && (
              <p className="text-[13px] text-text-md font-body mt-2 leading-relaxed">{group.rules}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0 max-md:w-full">
            <Link href={`/admin/group/${group.id}/edit`}>
              <Btn variant="outline" size="md">Edit</Btn>
            </Link>
            <DeleteGroupButton id={group.id} deletable={deletable} />
          </div>
        </div>
        {!deletable && (
          <p className="text-xs text-text-sm font-body mt-4 pt-4 border-t border-border-lt">
            Grup punya anggota/riwayat sehingga tidak bisa dihapus. Untuk menonaktifkan, ubah status ke INACTIVE lewat Edit.
          </p>
        )}
      </div>

      {/* Roster anggota */}
      <section className="mb-8">
        <h2 className="font-heading font-bold text-lg text-text mb-3">Anggota Grup</h2>
        <DataTable
          columns={MEMBER_COLUMNS}
          rows={group.members}
          empty="Belum ada anggota di grup ini."
          renderRow={(m) => {
            const payTxn = paymentByUser[m.user.id];
            const hasEscrow = payTxn && (payTxn.status === "HELD" || payTxn.status === "SUCCESS");
            return (
              <tr key={m.id}>
                <Td>
                  <div className="text-sm font-semibold text-text">{m.user.name}</div>
                  <div className="text-xs text-text-md">{m.user.email}</div>
                </Td>
                <Td>
                  <Tag variant={PAY_VARIANT[m.paymentStatus] || "muted"}>{m.paymentStatus}</Tag>
                </Td>
                <Td align="right">
                  <div className="flex justify-end">
                    {hasEscrow ? (
                      <TxnActions id={payTxn.id} type={payTxn.type} status={payTxn.status} />
                    ) : (
                      <RemoveMemberButton groupId={group.id} userId={m.user.id} memberName={m.user.name} />
                    )}
                  </div>
                </Td>
              </tr>
            );
          }}
        />
      </section>

      {/* Log transaksi grup */}
      <section>
        <h2 className="font-heading font-bold text-lg text-text mb-3">Transaksi Grup</h2>
        <DataTable
          columns={TXN_COLUMNS}
          rows={transactions}
          empty="Belum ada transaksi pada grup ini."
          renderRow={(t) => (
            <tr key={t.id}>
              <Td>
                <Tag variant={t.type === "REFUND" ? "primary" : "green"}>{TYPE_LABEL[t.type] || t.type}</Tag>
              </Td>
              <Td className="text-text-md text-[13px]">{t.user.name}</Td>
              <Td className="whitespace-nowrap text-text-md text-[13px]">{formatDate(t.createdAt)}</Td>
              <Td>
                <Tag variant={TXN_STATUS_VARIANT[t.status] || "primary"}>{t.status}</Tag>
              </Td>
              <Td align="right" className="font-heading font-bold whitespace-nowrap">{fmt(t.amount)}</Td>
            </tr>
          )}
        />
      </section>
    </div>
  );
}
