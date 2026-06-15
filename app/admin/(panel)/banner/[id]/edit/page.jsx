import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BannerForm from "@/components/admin/BannerForm";
import { ArrowLeftIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export default async function EditBannerPage({ params }) {
  const banner = await prisma.banner.findUnique({ where: { id: params.id } });
  if (!banner) notFound();
  const initial = {
    id: banner.id,
    title: banner.title,
    subtitle: banner.subtitle || "",
    ctaLabel: banner.ctaLabel || "",
    ctaHref: banner.ctaHref || "",
    order: banner.order,
    active: banner.active,
    imagePath: banner.imagePath,
  };
  return (
    <div>
      <Link
        href="/admin/banner"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-md font-body no-underline mb-4 hover:text-text"
      >
        <ArrowLeftIcon width={15} height={15} /> Kembali ke daftar
      </Link>
      <h1 className="font-heading font-bold text-2xl text-text mb-6">Edit Banner</h1>
      <BannerForm mode="edit" initial={initial} />
    </div>
  );
}
