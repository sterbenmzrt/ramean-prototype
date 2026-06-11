import Link from "next/link";
import RameanLogo from "@/components/ui/RameanLogo";

const NAV = [
  ["/", "Beranda"],
  ["/marketplace", "Katalog"],
  ["/login", "Masuk"],
  ["/register", "Daftar"],
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white px-10 pt-[72px] pb-9">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-[1.6fr_1fr] gap-14 mb-16 max-md:grid-cols-1 max-md:gap-10">
          <div>
            <Link href="/" className="inline-block mb-6">
              <RameanLogo size={34} />
            </Link>
            <p className="text-text-md font-body text-sm leading-relaxed max-w-[300px]">
              Patungan langganan digital dengan jaminan escrow. Bayar hanya
              bagianmu, akses tetap penuh.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold mb-[18px] tracking-[0.08em] uppercase text-text-sm font-body">
              Navigasi
            </h4>
            {NAV.map(([href, label]) => (
              <div key={href} className="mb-3">
                <Link
                  href={href}
                  className="text-text-md no-underline text-sm font-body font-normal hover:text-text"
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-7">
          <span className="text-text-sm text-xs font-body">
            © 2026 Ramean.id
          </span>
        </div>
      </div>
    </footer>
  );
}
