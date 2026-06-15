"use client";

import { useState } from "react";
import { ImageIcon } from "@/components/ui/icons";

// Gambar section beranda dengan fallback aman: bila src kosong atau file belum ada,
// tampilkan placeholder abu (anti broken-image, sesuai DoD). Taruh file di
// public/assets/home/ dengan nama yang sesuai, gambar langsung muncul.
export default function HomeImage({ src, alt = "", minHeight = 400 }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        className="w-full bg-[#E8EDF5] flex items-center justify-center rounded"
        style={{ minHeight }}
      >
        <ImageIcon width={48} height={48} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full rounded object-cover"
      style={{ height: minHeight }}
      onError={() => setFailed(true)}
    />
  );
}
