"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { initials } from "@/lib/util";

const NAV = [
  ["/akun", "Grup Saya"],
  ["/akun/profil", "Profil"],
  ["/akun/riwayat", "Riwayat"],
];

const itemBase =
  "px-4 min-h-[44px] flex items-center rounded-lg font-body text-sm transition-colors whitespace-nowrap no-underline";

export default function AccountSidebar({ name, email }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigasi akun"
      className="bg-white border border-border rounded-xl p-3 flex flex-col gap-1 max-md:flex-row max-md:overflow-x-auto max-md:gap-2"
    >
      <div className="flex items-center gap-2.5 px-2 py-2 mb-1 border-b border-border-lt max-md:hidden">
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-[15px] shrink-0">
          {initials(name)}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[13px] text-text font-body truncate">{name}</div>
          <div className="text-[11px] text-text-sm font-body truncate">{email}</div>
        </div>
      </div>

      {NAV.map(([href, label]) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`${itemBase} ${
              active ? "bg-[#EEF2FF] text-primary font-semibold" : "text-text-md font-medium"
            }`}
          >
            {label}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className={`${itemBase} text-text-md font-medium md:mt-auto md:border-t md:border-border-lt cursor-pointer bg-transparent border-none text-left`}
      >
        Keluar
      </button>
    </nav>
  );
}
