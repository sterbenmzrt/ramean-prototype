"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  ["/admin", "Dashboard"],
  ["/admin/group", "Group"],
  ["/admin/transaksi", "Transaksi"],
  ["/admin/service", "Service"],
  ["/admin/user", "User"],
];

const item =
  "px-4 min-h-[44px] flex items-center rounded-lg text-sm font-body transition-colors no-underline focus-visible:outline-white";

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi admin" className="flex flex-col gap-1 h-full">
      <div className="px-2 py-3 mb-2 border-b border-white/10">
        <div className="font-heading font-extrabold text-white text-lg">Ramean Admin</div>
      </div>
      {NAV.map(([href, label]) => {
        // "/admin" (dashboard) hanya aktif saat exact match, agar tidak menyala
        // di semua subrute admin. Item lain aktif untuk dirinya + subrutenya.
        const active =
          href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`${item} ${active ? "bg-white/15 text-white font-semibold" : "text-white/80"}`}
          >
            {label}
          </Link>
        );
      })}
      <div className="mt-auto pt-2 border-t border-white/10 flex flex-col gap-1">
        <Link href="/" className={`${item} text-white/80`}>
          ← Kembali ke situs
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`${item} text-white/80 bg-transparent border-none cursor-pointer text-left`}
        >
          Keluar
        </button>
      </div>
    </nav>
  );
}
