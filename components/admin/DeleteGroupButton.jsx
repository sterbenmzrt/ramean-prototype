"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Btn from "@/components/ui/Btn";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

// Hanya dirender saat grup boleh dihapus (kosong). API tetap menjadi penjaga akhir.
export default function DeleteGroupButton({ id, deletable }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!deletable) return null;

  async function run() {
    setBusy(true);
    const res = await fetch("/api/admin/group", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      router.push("/admin/group");
      router.refresh();
      return;
    }
    setBusy(false);
    setOpen(false);
    const d = await res.json().catch(() => ({}));
    alert(d.error || "Gagal menghapus grup.");
  }

  return (
    <>
      <Btn variant="danger" size="md" onClick={() => setOpen(true)}>
        Hapus
      </Btn>
      <ConfirmDialog
        open={open}
        danger
        title="Hapus grup ini?"
        body="Grup kosong akan dihapus permanen. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Ya, hapus"
        busy={busy}
        onConfirm={run}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
