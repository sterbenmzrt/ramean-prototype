"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SvcIcon from "@/components/ui/SvcIcon";
import { fmt } from "@/lib/tokens";

// Kartu layanan marketplace — port dari ServiceMarketCard/CatalogCard prototype.
export default function ServiceCard({ svc }) {
  const router = useRouter();
  const [hov, setHov] = useState(false);
  const go = () => router.push(`/service/${svc.id}`);

  return (
    <div
      onClick={go}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="bg-white rounded-2xl px-4 pt-5 pb-3.5 cursor-pointer flex flex-col items-center text-center gap-2.5 relative transition-all"
      style={{
        border: "1px solid " + (hov ? "#CBD5E0" : "#E2E8F0"),
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Badge status — teks, bukan hanya warna (a11y) */}
      {!svc.available && (
        <div className="absolute top-2.5 right-2.5 bg-warn-bg text-warn text-[10px] font-bold px-2 py-[3px] rounded-full font-body">
          Antri
        </div>
      )}
      {svc.available && svc.hot && (
        <div className="absolute top-2.5 right-2.5 bg-[#FEF9C3] text-[#92400E] text-[10px] font-bold px-2 py-[3px] rounded-full font-body">
          Terlaris
        </div>
      )}
      {svc.available && !svc.hot && (
        <div className="absolute top-2.5 left-2.5 bg-ok-bg text-ok text-[10px] font-bold px-2 py-[3px] rounded-full font-body">
          Hemat {svc.discount}%
        </div>
      )}

      <SvcIcon name={svc.name} logoUrl={svc.logoUrl} size={72} />

      <div className="font-heading font-bold text-sm text-text leading-tight">{svc.name}</div>

      <div className="font-heading font-extrabold text-[17px] text-[#D97706]">
        {fmt(svc.price)}
        <span className="text-[11px] font-medium text-text-md"> /30h</span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          go();
        }}
        className="w-full px-3.5 py-[9px] rounded-lg border-none text-white font-body font-semibold text-[13px] cursor-pointer transition-all mt-0.5"
        style={{ backgroundColor: svc.available ? "#03346E" : "#94A3B8" }}
      >
        {svc.available ? "Pesan" : "Daftar Antri"}
      </button>
    </div>
  );
}
