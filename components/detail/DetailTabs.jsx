"use client";

import { useState } from "react";
import Link from "next/link";
import SvcIcon from "@/components/ui/SvcIcon";
import { CheckIcon, UsersIcon } from "@/components/ui/icons";
import { fmt } from "@/lib/tokens";
import { obfuscateName } from "@/lib/util";

function FaqTab({ svc }) {
  const faqs = [
    { q: "Berapa lama aktivasi?", a: "Akun aktif dalam waktu kurang dari 1 jam setelah pembayaran dikonfirmasi." },
    { q: "Apakah kualitasnya sama dengan akun normal?", a: `Ya, 100% sama. Semua fitur ${svc.name} tetap tersedia penuh untuk slotmu.` },
    { q: "Apakah privasi saya aman?", a: "Aman. Pengguna lain dalam grup tidak dapat melihat aktivitas atau data pribadimu." },
    { q: "Bagaimana jika ada masalah?", a: "Ada jaminan Ramean — jika ada kendala akun, kami ganti akun atau refund proporsional." },
  ];
  return (
    <div>
      {faqs.map((item, i) => (
        <div
          key={item.q}
          className={`py-3.5 ${i < faqs.length - 1 ? "border-b border-border-lt" : ""}`}
        >
          <div className="font-semibold text-sm text-text mb-1.5 font-body">{item.q}</div>
          <div className="text-[13px] text-text-md leading-relaxed font-body">{item.a}</div>
        </div>
      ))}
    </div>
  );
}

function SkemaTab({ svc }) {
  const points = [
    "Setiap slot mendapat akses fitur yang sama persis",
    "Privasi terjaga — pengguna lain tidak dapat melihat aktivitasmu",
    "Jika satu anggota keluar, Ramean langsung carikan pengganti",
    "Garansi akun aktif selama periode berlanggananmu",
  ];
  const steps = [
    { step: "1", title: "Ramean membentuk grup", desc: `Ramean mengumpulkan beberapa pengguna untuk berbagi satu akun ${svc.name} premium.` },
    { step: "2", title: "Kamu bayar hanya bagianmu", desc: `Biaya ${fmt(svc.originalPrice)}/bulan dibagi anggota grup — kamu cukup bayar mulai ${fmt(svc.price)}/bulan.` },
    { step: "3", title: "Akun langsung aktif", desc: "Ramean mengelola semua teknis. Kamu langsung nikmati layanan tanpa repot." },
  ];
  return (
    <div>
      <p className="text-sm text-text-md leading-[1.7] font-body mb-4">
        Ramean memakai sistem <strong>akun grup</strong>. Satu akun premium dibeli bersama oleh
        beberapa pengguna dalam satu grup. Setiap pengguna mendapat akses penuh dengan biaya jauh
        lebih rendah.
      </p>
      <div className="flex flex-col gap-3 mb-5">
        {steps.map((s) => (
          <div key={s.step} className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-primary text-white font-heading font-bold text-xs flex items-center justify-center shrink-0">
              {s.step}
            </div>
            <div>
              <div className="font-body font-semibold text-[13px] text-text mb-0.5">{s.title}</div>
              <div className="font-body text-[13px] text-text-md leading-relaxed">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#EEF2FF] rounded-[10px] px-4 py-3.5">
        <div className="text-[11px] font-bold text-primary font-body tracking-[0.06em] uppercase mb-2.5">
          Jaminan Ramean
        </div>
        <div className="flex flex-col gap-[7px]">
          {points.map((t) => (
            <div key={t} className="flex gap-2 items-start">
              <CheckIcon className="text-primary shrink-0 mt-0.5" width={14} height={14} />
              <span className="text-[13px] text-text font-body">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GroupsTab({ svc }) {
  const openGroups = svc.groups.filter(
    (g) => g.status === "AVAILABLE" && g.filledSlots < g.totalSlots
  );
  const activeGroups = svc.groups.filter(
    (g) => !(g.status === "AVAILABLE" && g.filledSlots < g.totalSlots)
  );

  return (
    <div className="flex flex-col gap-7">
      {/* Grup mengumpulkan */}
      <div>
        <div className="flex items-center gap-2 mb-3.5 text-[#1D4ED8]">
          <UsersIcon width={20} height={20} />
          <span className="font-heading font-bold text-[15px]">Grup Sedang Mengumpulkan</span>
          <span className="ml-auto text-[11px] font-body font-medium text-text-md bg-border-lt px-2.5 py-[3px] rounded-full">
            {openGroups.length} grup
          </span>
        </div>
        {openGroups.length === 0 ? (
          <div className="text-[13px] text-text-md font-body py-4">
            Belum ada grup yang membuka slot. Semua grup sedang aktif/penuh.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {openGroups.map((g) => (
              <div key={g.id} className="border-[1.5px] border-[#BFDBFE] rounded-xl bg-[#FAFCFF] overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between border-b border-[#E0EEFF]">
                  <div className="flex items-center gap-2.5">
                    <SvcIcon name={svc.name} logoUrl={svc.logoUrl} size={36} />
                    <div>
                      <div className="font-heading font-bold text-sm text-text">
                        Grup {g.id.slice(-4).toUpperCase()}
                      </div>
                      <div className="font-body text-[11px] text-text-md">
                        {fmt(g.pricePerSlot)}/user
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#22C55E]" />
                    <span className="text-[11px] font-semibold text-[#16A34A] font-body">
                      {g.totalSlots - g.filledSlots} slot tersisa
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2.5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-text-md font-body">
                      Anggota ({g.filledSlots}/{g.totalSlots})
                    </span>
                    <Link href={`/checkout/${g.id}`}>
                      <span className="px-4 py-1.5 rounded-lg bg-[#F97316] text-white text-xs font-bold font-body cursor-pointer inline-block">
                        + Gabung
                      </span>
                    </Link>
                  </div>
                  {Array.from({ length: g.totalSlots }).map((_, idx) => {
                    const member = g.members[idx];
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2.5 py-[7px] ${idx > 0 ? "border-t border-border-lt" : ""}`}
                      >
                        <span className="text-xs font-semibold text-text-sm w-4 font-body shrink-0">
                          {idx + 1}
                        </span>
                        {member ? (
                          <span className="text-[13px] font-body text-text">{obfuscateName(member)}</span>
                        ) : (
                          <span className="text-[13px] font-body text-[#9CA3AF] italic">Tersedia</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grup aktif/penuh */}
      {activeGroups.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3.5 text-ok">
            <CheckIcon width={18} height={18} />
            <span className="font-heading font-bold text-[15px]">Grup Aktif</span>
            <span className="ml-auto text-[11px] font-body font-medium text-text-md bg-border-lt px-2.5 py-[3px] rounded-full">
              {activeGroups.length} grup
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 max-md:grid-cols-1">
            {activeGroups.map((g) => (
              <div key={g.id} className="border border-border rounded-xl bg-white overflow-hidden">
                <div className="px-3 py-2.5 border-b border-border-lt flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SvcIcon name={svc.name} logoUrl={svc.logoUrl} size={28} />
                    <div className="font-heading font-bold text-xs text-text">
                      Grup {g.id.slice(-4).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                    <span className="text-[10px] font-semibold text-[#2563EB] font-body">
                      {g.status === "FULL" ? "Penuh" : "Aktif"}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <div className="text-[10px] text-text-sm font-body mb-1">
                    {g.filledSlots}/{g.totalSlots} anggota
                  </div>
                  {g.members.map((m, idx) => (
                    <div
                      key={idx}
                      className={`text-[11px] text-text font-body py-[3px] ${idx > 0 ? "border-t border-border-lt" : ""}`}
                    >
                      {idx + 1}. {obfuscateName(m)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DetailTabs({ svc }) {
  const [tab, setTab] = useState("groups");
  const tabs = [
    { id: "groups", label: "Grup Tersedia" },
    { id: "skema", label: "Cara Ramean Bekerja" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="bg-white border border-border">
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-3.5 cursor-pointer bg-none border-none font-body text-[13px] whitespace-nowrap transition-all -mb-px ${
              tab === t.id
                ? "border-b-2 border-primary text-primary font-semibold"
                : "border-b-2 border-transparent text-text-md font-normal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="px-7 py-6">
        {tab === "groups" && <GroupsTab svc={svc} />}
        {tab === "skema" && <SkemaTab svc={svc} />}
        {tab === "faq" && <FaqTab svc={svc} />}
      </div>
    </div>
  );
}
