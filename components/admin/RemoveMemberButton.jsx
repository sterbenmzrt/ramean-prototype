"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Btn from "@/components/ui/Btn";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// Untuk anggota tanpa pembayaran aktif (mis. data seed). Anggota ber-escrow
// dikeluarkan lewat Refund, bukan tombol ini.
export default function RemoveMemberButton({ groupId, userId, memberName }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const res = await fetch("/api/admin/member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, userId }),
    });
    setBusy(false);
    setOpen(false);
    if (res.ok) {
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Gagal mengeluarkan anggota.");
    }
  }

  return (
    <>
      <Btn variant="outline" size="sm" onClick={() => setOpen(true)}>
        Keluarkan
      </Btn>
      <ConfirmDialog
        open={open}
        danger
        title="Keluarkan anggota?"
        body={`${memberName} akan dikeluarkan dari grup dan slotnya dibebaskan. Tanpa pengembalian dana karena tidak ada pembayaran aktif.`}
        confirmLabel="Ya, keluarkan"
        busy={busy}
        onConfirm={run}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
