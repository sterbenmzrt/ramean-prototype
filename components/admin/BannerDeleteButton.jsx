"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Btn from "@/components/ui/Btn";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function BannerDeleteButton({ id, title }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    const res = await fetch("/api/admin/banner", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      <Btn variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Hapus
      </Btn>
      <ConfirmDialog
        open={open}
        title="Hapus banner?"
        body={`Banner "${title}" akan dihapus permanen beserta gambarnya.`}
        confirmLabel="Ya, hapus"
        danger
        busy={busy}
        onConfirm={confirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
