import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceDetail } from "@/lib/data";
import SvcIcon from "@/components/ui/SvcIcon";
import Tag from "@/components/ui/Tag";
import Btn from "@/components/ui/Btn";
import DetailTabs from "@/components/detail/DetailTabs";
import { fmt } from "@/lib/tokens";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }) {
  const svc = await getServiceDetail(params.id);
  if (!svc) notFound();

  const firstOpen = svc.groups.find(
    (g) => g.status === "AVAILABLE" && g.filledSlots < g.totalSlots
  );
  const price = firstOpen ? firstOpen.pricePerSlot : svc.price;
  const slots = firstOpen ? firstOpen.totalSlots : svc.groups[0]?.totalSlots || 1;
  const savings = svc.originalPrice - price;

  return (
    <div className="bg-bg min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border px-10">
        <div className="max-w-[1240px] mx-auto h-12 flex items-center gap-2 text-sm text-text-md font-body">
          <Link href="/" className="text-text font-medium no-underline">Beranda</Link>
          <span className="text-border">›</span>
          <Link href="/marketplace" className="text-text font-medium no-underline">Katalog</Link>
          <span className="text-border">›</span>
          <span className="text-text-md">{svc.name}</span>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-10 py-12 grid grid-cols-[1fr_360px] gap-10 items-start max-md:grid-cols-1">
        {/* LEFT */}
        <div className="flex flex-col gap-5">
          {/* Hero */}
          <div className="bg-white border border-border p-8">
            <div className="flex items-start gap-5 mb-6">
              <SvcIcon name={svc.name} logoUrl={svc.logoUrl} size={64} />
              <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <h1 className="font-heading font-bold text-[26px] text-text m-0">{svc.name}</h1>
                  {svc.hot && <Tag variant="yellow">Terlaris</Tag>}
                  {!svc.available && <Tag variant="warn">Menunggu Slot</Tag>}
                </div>
                <Tag variant="primary">{svc.categoryLabel}</Tag>
                <p className="text-text-md text-sm mt-3 leading-[1.7] font-body">{svc.description}</p>
              </div>
            </div>
          </div>

          {/* Tabs: Grup / Cara kerja / FAQ */}
          <DetailTabs svc={svc} />
        </div>

        {/* RIGHT — sticky summary */}
        <div className="sticky top-[84px] flex flex-col max-md:static">
          <div className="bg-white border border-border overflow-hidden rounded-xl">
            <div className="bg-primary px-6 py-5">
              <div className="text-white/70 text-xs mb-1 font-body">Harga via Ramean</div>
              <div className="font-heading font-bold text-[32px] text-white">{fmt(price)}</div>
              <div className="text-white/70 text-[13px] mt-1 font-body">
                per bulan · per slot dari {slots} pengguna
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="flex justify-between text-[13px] mb-2.5 font-body">
                <span className="text-text-md">Layanan</span>
                <span className="font-medium text-text">{svc.name}</span>
              </div>

              {/* Skema "Ramean hitung untukmu" */}
              <div className="bg-bg rounded-lg px-3.5 py-3 mb-3.5 border border-border-lt">
                <div className="text-[10px] font-bold text-primary font-body tracking-[0.07em] uppercase mb-2.5">
                  Ramean Hitung Ini Untukmu
                </div>
                {[
                  { label: `Harga resmi ${svc.name}`, sub: "per bulan", value: fmt(svc.originalPrice), muted: true },
                  { label: `Dibagi ${slots} pengguna`, sub: "dalam 1 grup", value: `÷ ${slots}`, muted: true },
                  { label: "Harga per slot", sub: "yang kamu bayar", value: fmt(price), primary: true },
                  { label: "Total kamu hemat", sub: "vs beli langsung", value: "- " + fmt(savings), green: true },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center py-1.5 ${i > 0 ? "border-t border-border-lt" : ""}`}
                  >
                    <div>
                      <div className={`text-xs font-body ${row.muted ? "text-text-md" : "text-text"}`}>{row.label}</div>
                      <div className="text-[10px] text-text-sm font-body">{row.sub}</div>
                    </div>
                    <div
                      className="font-heading font-bold text-xs whitespace-nowrap"
                      style={{ color: row.green ? "#059669" : row.primary ? "#03346E" : "#475569" }}
                    >
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 mb-3.5 flex justify-between items-center">
                <span className="font-semibold text-sm text-text font-body">Total / bulan</span>
                <span className="font-heading font-bold text-lg text-primary">{fmt(price)}</span>
              </div>

              {firstOpen ? (
                <Link href={`/checkout/${firstOpen.id}`}>
                  <Btn variant="primary" full size="lg">
                    Pesan Sekarang
                  </Btn>
                </Link>
              ) : (
                <>
                  <Btn variant="muted" full size="lg" disabled>
                    Slot Penuh
                  </Btn>
                  <div className="mt-2.5 px-3 py-2.5 bg-warn-bg rounded-lg text-xs text-[#92400E] font-body leading-relaxed">
                    Semua grup sedang penuh. Cek lagi nanti — Ramean rutin membuka grup baru.
                  </div>
                </>
              )}

              <div className="mt-2.5 flex flex-col gap-1.5">
                {["Pembayaran 100% aman (escrow)", "Aktivasi dalam 1 jam", "Garansi Ramean"].map((t) => (
                  <div key={t} className="text-[11px] text-text-md text-center font-body">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
