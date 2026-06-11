import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGroupLobby } from "@/lib/data";
import SvcIcon from "@/components/ui/SvcIcon";
import Btn from "@/components/ui/Btn";
import Tag from "@/components/ui/Tag";
import { CheckIcon, ShieldIcon, LockIcon } from "@/components/ui/icons";
import { fmt } from "@/lib/tokens";
import { obfuscateName, initials } from "@/lib/util";

export const dynamic = "force-dynamic";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function LobbyPage({ params }) {
  const { groupId } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/lobby/${groupId}`);
  }

  const group = await getGroupLobby(groupId);
  if (!group) notFound();

  const myId = session.user.id;
  const isMember = group.members.some((m) => m.user.id === myId);
  const svc = group.service;

  return (
    <div className="bg-bg min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-border px-10 py-8">
        <div className="max-w-[820px] mx-auto flex items-center gap-4 max-md:flex-col max-md:items-start">
          <SvcIcon name={svc.name} logoUrl={svc.logoUrl} size={56} />
          <div className="flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-heading font-bold text-[24px] text-text m-0">
                {svc.name} — Grup {group.id.slice(-4).toUpperCase()}
              </h1>
              <Tag variant={group.status === "FULL" ? "primary" : "green"}>
                {group.status === "FULL" ? "Grup Penuh" : "Mengumpulkan"}
              </Tag>
            </div>
            <div className="text-[13px] text-text-md font-body mt-1">
              Host: {group.hostName} · {group.filledSlots}/{group.totalSlots} slot terisi
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[820px] mx-auto px-10 py-9 grid grid-cols-[1fr_300px] gap-6 items-start max-md:grid-cols-1 max-md:px-5">
        {/* LEFT — anggota */}
        <div className="flex flex-col gap-5">
          {!isMember && (
            <div className="px-4 py-3.5 rounded-xl bg-warn-bg border border-[#FCD34D] text-[13px] text-[#92400E] font-body leading-relaxed">
              Kamu belum tergabung di grup ini.{" "}
              <Link href={`/service/${svc.id}`} className="font-semibold underline">
                Lihat detail layanan
              </Link>{" "}
              untuk bergabung.
            </div>
          )}

          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="font-heading font-bold text-base text-text mb-1">Anggota Grup</h2>
            <p className="text-xs text-text-md font-body mb-4">
              Demi privasi, nama anggota lain disamarkan. Hanya kamu yang tahu identitas aslimu.
            </p>
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: group.totalSlots }).map((_, idx) => {
                const m = group.members[idx];
                const mine = m && m.user.id === myId;
                if (!m) {
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-bg border border-dashed border-border"
                    >
                      <div className="w-9 h-9 rounded-full border border-dashed border-border shrink-0" />
                      <div className="text-[13px] text-text-sm font-body italic">Slot tersedia</div>
                    </div>
                  );
                }
                const label = mine ? "Kamu" : obfuscateName(m.user.name);
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] border"
                    style={{
                      backgroundColor: mine ? "#EEF2FF" : "#FFFFFF",
                      borderColor: mine ? "#03346E" : "#E2E8F0",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-[13px] text-white shrink-0"
                      style={{ backgroundColor: mine ? "#03346E" : "#94A3B8" }}
                    >
                      {mine ? initials(session.user.name) : initials(m.user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-text font-body truncate">
                        {label}
                        {mine && <span className="ml-2 text-[10px] text-primary font-bold">● kamu</span>}
                      </div>
                      <div className="text-[11px] text-text-sm font-body">
                        {m.paymentStatus === "PAID" ? "Pembayaran lunas" : "Menunggu pembayaran"}
                      </div>
                    </div>
                    <CheckIcon className="text-ok shrink-0" width={16} height={16} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Akses kredensial (placeholder — fitur penuh di iterasi berikut) */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2 text-text-md">
              <LockIcon width={18} height={18} />
              <h2 className="font-heading font-bold text-base text-text m-0">Akses Akun</h2>
            </div>
            <p className="text-[13px] text-text-md font-body leading-relaxed mb-4">
              Kredensial akun dienkripsi dan dirilis setelah escrow terverifikasi. Pada demo MVP,
              detail akun dikirim oleh Ramean dalam 1 jam.
            </p>
            <Btn variant="muted" size="md" disabled>
              Kredensial menyusul (1 jam)
            </Btn>
          </div>
        </div>

        {/* RIGHT — info grup */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-border rounded-xl p-5">
            <div className="text-[11px] font-semibold text-text-sm tracking-[0.07em] uppercase font-body mb-3.5">
              Info Grup
            </div>
            {[
              ["Layanan", svc.name],
              ["Harga / slot", fmt(group.pricePerSlot) + " /bln"],
              ["Slot terisi", `${group.filledSlots} / ${group.totalSlots}`],
              ["Perpanjangan", formatDate(group.renewalDate)],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`flex justify-between items-center py-2.5 ${i > 0 ? "border-t border-border-lt" : ""}`}
              >
                <span className="text-[13px] text-text-md font-body">{k}</span>
                <span className="text-[13px] font-semibold text-text font-body text-right">{v}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#EEF2FF] rounded-xl p-4 flex gap-2.5 items-start">
            <span className="text-primary shrink-0 mt-0.5">
              <ShieldIcon width={18} height={18} />
            </span>
            <div className="text-xs text-text-md font-body leading-relaxed">
              <strong className="text-primary">Dilindungi escrow.</strong> Dana ditahan Ramean
              sampai akses kamu terverifikasi.
            </div>
          </div>

          {group.rules && (
            <div className="bg-white border border-border rounded-xl p-5">
              <div className="text-[11px] font-semibold text-text-sm tracking-[0.07em] uppercase font-body mb-2.5">
                Aturan Grup
              </div>
              <p className="text-[13px] text-text-md font-body leading-relaxed">{group.rules}</p>
            </div>
          )}

          <Link href="/marketplace">
            <Btn variant="outline" full size="md">Jelajahi Layanan Lain</Btn>
          </Link>
        </div>
      </div>
    </div>
  );
}
