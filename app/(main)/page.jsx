import Link from "next/link";
import { getServiceCards } from "@/lib/data";
import ServiceGrid from "@/components/marketplace/ServiceGrid";
import Btn from "@/components/ui/Btn";
import Reveal from "@/components/ui/Reveal";
import { ImageIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

// ── Helper presentational components (server) ──────────────────────────────
function SectionHeading({ tagline, title, desc, align = "left" }) {
  return (
    <div className={`mb-12 ${align === "center" ? "text-center" : ""}`}>
      {tagline && (
        <div className="text-xs font-semibold text-text-md font-body tracking-[0.08em] uppercase mb-4">
          {tagline}
        </div>
      )}
      <h2 className="font-heading font-bold text-[38px] text-text leading-[1.15] tracking-[-0.5px] mb-4 max-md:text-[30px]">
        {title}
      </h2>
      {desc && (
        <p
          className={`text-text-md text-base leading-relaxed font-body ${
            align === "center" ? "max-w-[560px] mx-auto" : "max-w-[480px]"
          }`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}

function ImagePlaceholder({ minHeight = 400 }) {
  return (
    <div
      className="w-full bg-[#E8EDF5] flex items-center justify-center rounded"
      style={{ minHeight }}
    >
      <ImageIcon width={48} height={48} />
    </div>
  );
}

function StepCard({ label, title, desc, ctaLabel, active = false }) {
  return (
    <div className={`border border-border bg-white ${active ? "p-10" : "px-10 py-7"}`}>
      <div className="text-[11px] font-semibold text-text-md tracking-[0.08em] uppercase font-body mb-3">
        {label}
      </div>
      <h3 className={`font-heading font-bold mb-3 text-text leading-tight ${active ? "text-[28px]" : "text-[22px]"}`}>
        {title}
      </h3>
      <p className="text-text-md text-[15px] leading-relaxed mb-6 font-body">{desc}</p>
      <div className="flex gap-3 items-center">
        <Link href="/marketplace">
          <Btn variant="outline" size={active ? "md" : "sm"}>
            {ctaLabel}
          </Btn>
        </Link>
      </div>
    </div>
  );
}

function WhyItem({ num, title, desc }) {
  return (
    <div className="flex gap-7 mb-11 relative z-[1]">
      <div className="w-11 h-11 bg-white border-[1.5px] border-border flex items-center justify-center font-heading font-bold text-[15px] text-text shrink-0 rounded-sm">
        {num}
      </div>
      <div className="pt-1.5">
        <h4 className="font-heading font-semibold text-lg mb-2 text-text">{title}</h4>
        <p className="text-text-md text-sm leading-relaxed font-body">{desc}</p>
      </div>
    </div>
  );
}

// ── Landing page ───────────────────────────────────────────────────────────
export default async function LandingPage() {
  const services = await getServiceCards();

  return (
    <div className="bg-bg">
      {/* HERO */}
      <section className="max-w-[1240px] mx-auto px-10 py-20 grid grid-cols-2 gap-16 items-center max-md:grid-cols-1">
        <div>
          <h1 className="font-heading font-bold text-[52px] leading-[1.12] text-text mb-6 tracking-[-1px] max-md:text-4xl">
            Nikmati layanan premium tanpa biaya penuh
          </h1>
          <p className="text-[17px] text-text-md leading-relaxed mb-10 max-w-[460px] font-body">
            Ramean menggabungkanmu ke grup patungan untuk Netflix, Canva, AI tools, dan
            lainnya — jadi kamu cukup bayar bagianmu. Dana ditahan di escrow sampai akses
            kamu terverifikasi.
          </p>
          <div className="flex gap-3.5">
            <Link href="/marketplace">
              <Btn variant="primary" size="lg">
                Lihat Layanan
              </Btn>
            </Link>
            <Link href="/register">
              <Btn variant="outline" size="lg">
                Mulai Gratis
              </Btn>
            </Link>
          </div>
        </div>
        <ImagePlaceholder minHeight={480} />
      </section>

      {/* HOW IT WORKS */}
      <Reveal>
      <section className="max-w-[1240px] mx-auto px-10 py-20 border-t border-border">
        <SectionHeading
          tagline="Cara Kerja"
          title="Tiga langkah untuk memulai"
          desc="Pilih layanan, bayar, dan langsung nikmati. Tidak ada proses panjang, tidak ada syarat rumit."
          align="center"
        />
        <div className="grid grid-cols-2 gap-10 mt-10 max-md:grid-cols-1">
          <ImagePlaceholder minHeight={540} />
          <div className="flex flex-col gap-4">
            <StepCard label="Langkah 1" title="Pilih layanan yang kamu inginkan" desc="Jelajahi katalog kami dan temukan layanan yang paling sesuai. Netflix, Canva, Gemini, dan banyak lagi tersedia dengan harga jauh di bawah normal." ctaLabel="Lihat Katalog" active />
            <StepCard label="Langkah 2" title="Lakukan pembayaran dengan mudah" desc="Bayar bagianmu lewat Saldo Ramean. Dana ditahan di escrow sampai akses kamu terverifikasi, aman dari penipuan." ctaLabel="Bayar Sekarang" />
            <StepCard label="Langkah 3" title="Akun langsung aktif, siap dipakai" desc="Terima detail akun premium di lobby grupmu dalam waktu singkat. Semua info grup dan anggota ada di satu tempat." ctaLabel="Mulai Sekarang" />
          </div>
        </div>
      </section>
      </Reveal>

      {/* WHY CHOOSE */}
      <Reveal>
      <section className="max-w-[1240px] mx-auto px-10 py-20 border-t border-border">
        <div className="grid grid-cols-2 gap-20 max-md:grid-cols-1 max-md:gap-10">
          <div>
            <SectionHeading
              tagline="Kenapa Ramean"
              title="Dibuat untuk kamu yang menghargai waktu dan uang"
            />
            <p className="text-[15px] text-text-md leading-relaxed mb-8 font-body">
              Kami percaya bahwa akses ke layanan digital premium seharusnya tidak menguras
              kantong. Ramean hadir sebagai solusi praktis yang sudah terbukti.
            </p>
            <Link href="/marketplace">
              <Btn variant="outline" size="md">
                Jelajahi Sekarang
              </Btn>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute left-[22px] top-11 bottom-5 w-px bg-border" />
            <WhyItem num="01" title="Tanpa ikatan tahunan" desc="Patungan dihitung per bulan. Tidak ada komitmen jangka panjang yang mengikat." />
            <WhyItem num="02" title="Bayar hanya yang kamu pakai" desc="Harga transparan, tidak ada biaya tersembunyi. Apa yang kamu lihat adalah yang kamu bayar." />
            <WhyItem num="03" title="Dilindungi escrow" desc="Dana kamu ditahan Ramean sampai akses terverifikasi, bukan transfer langsung ke orang asing. Aman dari penipuan." />
            <WhyItem num="04" title="Grup selalu terjaga" desc="Kalau ada anggota keluar, Ramean carikan pengganti supaya patunganmu tetap berjalan." />
          </div>
        </div>
      </section>
      </Reveal>

      {/* WHAT WE OFFER (marketplace grid dari DB) */}
      <Reveal>
      <section className="max-w-[1240px] mx-auto px-10 py-20 border-t border-border">
        <div className="text-center mb-12">
          <div className="text-[11px] font-semibold text-text-md font-body tracking-[0.08em] uppercase mb-4">
            Layanan Kami
          </div>
          <h2 className="font-heading font-bold text-[38px] text-text leading-[1.15] tracking-[-0.5px] mb-4 max-md:text-[30px]">
            Semua yang kamu butuhkan ada di sini
          </h2>
          <p className="text-text-md text-base leading-relaxed max-w-[560px] mx-auto font-body">
            Dari hiburan hingga produktivitas dan AI — satu platform untuk semua kebutuhanmu,
            dengan harga terbaik.
          </p>
        </div>
        <ServiceGrid services={services} centered />
        <div className="text-center mt-9">
          <Link href="/marketplace">
            <Btn variant="outline" size="md">
              Lihat Semua Layanan
            </Btn>
          </Link>
        </div>
      </section>
      </Reveal>

      {/* PERSONAL SERVICE CTA */}
      <Reveal>
      <section className="max-w-[1240px] mx-auto px-10 pt-20 pb-[100px] border-t border-border">
        <div className="grid grid-cols-2 gap-20 items-center max-md:grid-cols-1 max-md:gap-10">
          <div>
            <div className="text-[11px] font-semibold text-text-md tracking-[0.08em] uppercase font-body mb-5">
              Butuh akun pribadi?
            </div>
            <h2 className="font-heading font-bold text-[40px] leading-[1.15] text-text mb-5 tracking-[-0.5px] max-md:text-[30px]">
              Kalau kamu butuh akun hanya untuk dirimu sendiri, kami juga bisa bantu.
            </h2>
            <p className="text-[15px] text-text-md leading-relaxed mb-9 font-body">
              Tidak semua orang cocok dengan sistem berbagi. Jika kamu ingin akun eksklusif untuk
              penggunaan pribadi — kami menyediakan paket perorangan dengan akses penuh dan
              privasi terjaga.
            </p>
            <Link href="/register">
              <Btn variant="primary" size="lg">
                Daftar Sekarang
              </Btn>
            </Link>
          </div>
          <ImagePlaceholder minHeight={440} />
        </div>
      </section>
      </Reveal>
    </div>
  );
}
