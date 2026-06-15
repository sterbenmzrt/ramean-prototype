import Link from "next/link";
import { getAdminBanners } from "@/lib/admin";
import Btn from "@/components/ui/Btn";
import Tag from "@/components/ui/Tag";
import DataTable, { Td } from "@/components/admin/DataTable";
import BannerDeleteButton from "@/components/admin/BannerDeleteButton";
import { CheckIcon, EyeOffIcon, ImageIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

const COLUMNS = [
  { key: "img", label: "Gambar" },
  { key: "title", label: "Judul" },
  { key: "order", label: "Urutan" },
  { key: "status", label: "Status" },
  { key: "action", label: "", align: "right" },
];

export default async function AdminBannerPage() {
  const banners = await getAdminBanners();
  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="font-heading font-bold text-2xl text-text">Kelola Banner</h1>
        <Link href="/admin/banner/baru">
          <Btn variant="primary" size="md">+ Buat Banner</Btn>
        </Link>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={banners}
        empty="Belum ada banner."
        renderRow={(b) => (
          <tr key={b.id}>
            <Td>
              <div className="w-16 h-10 rounded bg-[#E8EDF5] overflow-hidden flex items-center justify-center">
                {b.imagePath ? (
                  <img src={b.imagePath} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon width={20} height={20} />
                )}
              </div>
            </Td>
            <Td className="font-semibold">{b.title}</Td>
            <Td className="text-text-md text-[13px]">{b.order}</Td>
            <Td>
              {b.active ? (
                <Tag variant="green">
                  <span className="inline-flex items-center gap-1">
                    <CheckIcon width={13} height={13} /> Aktif
                  </span>
                </Tag>
              ) : (
                <Tag variant="muted">
                  <span className="inline-flex items-center gap-1">
                    <EyeOffIcon width={13} height={13} /> Nonaktif
                  </span>
                </Tag>
              )}
            </Td>
            <Td align="right">
              <div className="inline-flex gap-2">
                <Link href={`/admin/banner/${b.id}/edit`}>
                  <Btn variant="outline" size="sm">Kelola</Btn>
                </Link>
                <BannerDeleteButton id={b.id} title={b.title} />
              </div>
            </Td>
          </tr>
        )}
      />
    </div>
  );
}
