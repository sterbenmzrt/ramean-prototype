import Link from "next/link";
import RameanLogo from "@/components/ui/RameanLogo";

const COLUMNS = [
  { title: "Layanan", links: ["Katalog", "Streaming", "Produktivitas", "AI Tools"] },
  { title: "Perusahaan", links: ["Tentang Kami", "Blog", "Karir", "Hubungi Kami"] },
  { title: "Sosial", links: ["Instagram", "X / Twitter", "LinkedIn", "YouTube"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white px-10 pt-[72px] pb-9">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-14 mb-16 max-md:grid-cols-2 max-md:gap-10">
          <div>
            <Link href="/" className="inline-block mb-6">
              <RameanLogo size={34} />
            </Link>
            <p className="text-text-md font-body text-sm leading-relaxed mb-5 max-w-[260px]">
              Dapatkan update terbaru tentang layanan dan fitur baru Ramean.
            </p>
            <div className="flex gap-2 mb-2 max-w-[320px]">
              <input
                type="email"
                placeholder="Email kamu"
                aria-label="Email langganan"
                className="flex-1 px-3.5 py-2.5 rounded-lg border border-border font-body text-[13px] outline-none text-text"
              />
              <button className="px-4 py-2 rounded-lg border border-border text-text font-body text-[13px] font-medium">
                Langganan
              </button>
            </div>
            <p className="text-text-sm text-[11px] font-body">
              Kami hanya kirim yang penting. Tidak ada spam.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold mb-[18px] tracking-[0.08em] uppercase text-text-sm font-body">
                {col.title}
              </h4>
              {col.links.map((l) => (
                <div key={l} className="mb-3">
                  <a href="#" className="text-text-md no-underline text-sm font-body font-normal hover:text-text">
                    {l}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-7 flex justify-between items-center flex-wrap gap-4">
          <span className="text-text-sm text-xs font-body">
            © 2025 Ramean.id · All rights reserved.
          </span>
          <div className="flex gap-6">
            {["Kebijakan Privasi", "Syarat & Ketentuan", "Pengaturan Cookie"].map((l) => (
              <a key={l} href="#" className="text-text-sm text-xs no-underline font-body">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
