import { getServiceCards } from "@/lib/data";
import ServiceGrid from "@/components/marketplace/ServiceGrid";

export const dynamic = "force-dynamic";

export const metadata = { title: "Katalog — Ramean.id" };

export default async function MarketplacePage() {
  const services = await getServiceCards();

  return (
    <div className="bg-bg min-h-screen">
      {/* Hero header */}
      <div className="bg-white border-b border-border px-10 pt-[72px] pb-16 text-center">
        <div className="max-w-[800px] mx-auto">
          <h1 className="font-heading font-bold text-5xl text-text mb-4 tracking-[-1px] leading-[1.1] max-md:text-4xl">
            Jelajahi Katalog Kami
          </h1>
          <p className="text-text-md text-[17px] leading-relaxed font-body max-w-[520px] mx-auto">
            Temukan layanan yang tepat untukmu. Streaming, produktivitas, AI tools, dan
            lainnya — dengan harga hingga 93% lebih hemat.
          </p>
        </div>
      </div>

      {/* Filter + grid */}
      <div className="max-w-[1240px] mx-auto px-10 py-12">
        <div className="mb-9">
          <div className="text-[11px] font-semibold text-text-sm tracking-[0.08em] uppercase font-body mb-2">
            Layanan
          </div>
          <h2 className="font-heading font-bold text-[28px] text-text m-0">Katalog</h2>
          <p className="text-text-md text-[13px] font-body mt-1">
            Filter berdasarkan kategori untuk menemukan yang kamu butuhkan
          </p>
        </div>

        <ServiceGrid services={services} />
      </div>
    </div>
  );
}
