"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import RameanLogo from "@/components/ui/RameanLogo";
import Btn from "@/components/ui/Btn";
import { initials } from "@/lib/util";

const LINKS = [
  ["/marketplace", "Katalog"],
  ["/", "Beranda"],
];

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";

  return (
    <nav className="sticky top-0 z-[200] bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[1240px] mx-auto px-10 h-[68px] flex items-center justify-between gap-8">
        <Link href="/" aria-label="Ramean.id beranda">
          <RameanLogo size={34} />
        </Link>

        <div className="flex gap-1.5 items-center">
          {LINKS.map(([href, label]) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg font-body text-sm font-medium transition-all ${
                  active ? "text-primary bg-[#EEF2FF]" : "text-text-md"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex gap-2.5 items-center">
          {loggedIn ? (
            <>
              <div
                className="w-[38px] h-[38px] rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-[15px]"
                title={session.user?.name}
                aria-label={session.user?.name}
              >
                {initials(session.user?.name)}
              </div>
              <Btn variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Keluar
              </Btn>
            </>
          ) : (
            <>
              <Link href="/login">
                <Btn variant="outline" size="sm">
                  Masuk
                </Btn>
              </Link>
              <Link href="/register">
                <Btn variant="primary" size="sm">
                  Daftar Gratis
                </Btn>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
