"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SvcIcon from "@/components/ui/SvcIcon";
import { fmt } from "@/lib/tokens";

// Kartu layanan marketplace — pola stretched-link agar seluruh kartu klik + keyboard-operable.
export default function ServiceCard({ svc }) {
  const router = useRouter();
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="bg-white rounded-2xl px-4 pt-5 pb-3.5 flex flex-col items-center text-center gap-2.5 relative transition-all"
      style={{
        border: "1px solid " + (hov ? "#CBD5E0" : "#E2E8F0"),
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Badge status — teks, bukan hanya warna (a11y). z-[1] agar di atas overlay link */}
      {!svc.available && (
        <div className="absolute top-2.5 right-2.5 z-[1] bg-warn-bg text-warn text-[10px] font-bold px-2 py-[3px] rounded-full font-body">
          Antri
        </div>
      )}
      {svc.available && svc.hot && (
        <div className="absolute top-2.5 right-2.5 z-[1] bg-[#FEF9C3] text-[#92400E] text-[10px] font-bold px-2 py-[3px] rounded-full font-body">
          Terlaris
        </div>
      )}
      {svc.available && !svc.hot && (
        <div className="absolute top-2.5 left-2.5 z-[1] bg-ok-bg text-ok text-[10px] font-bold px-2 py-[3px] rounded-full font-body">
          Hemat {svc.discount}%
        </div>
      )}

      <SvcIcon name={svc.name} logoUrl={svc.logoUrl} size={72} />

      {/* Nama = link utama; overlay after:inset-0 membuat seluruh kartu klik + fokusabel via keyboard */}
      <Link
        href={`/service/${svc.id}`}
        className="font-heading font-bold text-sm text-text leading-tight no-underline after:absolute after:inset-0 after:content-['']"
      >
        {svc.name}
      </Link>

      <div className="font-heading font-extrabold text-[17px] text-primary">
        {fmt(svc.price)}
        <span className="text-[11px] font-medium text-text-md"> /30h</span>
      </div>

      <button
        onClick={() => router.push(`/service/${svc.id}`)}
        className="relative z-[1] w-full px-3.5 py-2.5 min-h-[44px] rounded-lg border-none text-white font-body font-semibold text-[13px] cursor-pointer transition-all mt-0.5"
        style={{ backgroundColor: svc.available ? "#03346E" : "#94A3B8" }}
      >
        {svc.available ? "Pesan" : "Daftar Antri"}
      </button>
    </div>
  );
}
