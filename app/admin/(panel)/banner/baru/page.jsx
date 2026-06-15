import BannerForm from "@/components/admin/BannerForm";

export const dynamic = "force-dynamic";

export default function BuatBannerPage() {
  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-text mb-6">Buat Banner</h1>
      <BannerForm mode="create" />
    </div>
  );
}
