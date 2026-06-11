"use client";

import { useState } from "react";
import ServiceCard from "./ServiceCard";
import { FILTER_CATEGORIES } from "@/lib/data";

// Grid layanan dengan filter kategori. `centered` = gaya tab landing (pill di tengah);
// default = gaya katalog (tombol kiri).
export default function ServiceGrid({ services, centered = false }) {
  const [cat, setCat] = useState("Semua");
  const filtered =
    cat === "Semua" ? services : services.filter((s) => s.categoryLabel === cat);

  return (
    <div>
      <div className={`flex gap-2 mb-9 ${centered ? "justify-center" : ""} flex-wrap`}>
        {FILTER_CATEGORIES.map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-[18px] py-2.5 min-h-[44px] inline-flex items-center cursor-pointer font-body text-[13px] font-medium transition-all border ${
                centered ? "rounded-full" : "rounded-md"
              } ${
                active
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-text-md border-border"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-text-md font-body">
          Belum ada layanan di kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2">
          {filtered.map((svc) => (
            <ServiceCard key={svc.id} svc={svc} />
          ))}
        </div>
      )}
    </div>
  );
}
