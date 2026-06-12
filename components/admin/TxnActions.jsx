"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Btn from "@/components/ui/Btn";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function TxnActions({ id, type, status }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null); // "release" | "refund" | null

  const canRelease = type === "PAYMENT" && status === "HELD";
  const canRefund = type === "PAYMENT" && (status === "HELD" || status === "SUCCESS");
  if (!canRelease && !canRefund) return null;

  async function run(action) {
    setBusy(true);
    const res = await fetch("/api/admin/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setBusy(false);
    setConfirm(null);
    if (res.ok) {
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Gagal memproses.");
    }
  }

  return (
    <div className="flex gap-2 items-center justify-end">
      {canRelease && (
        <Btn variant="primary" size="sm" onClick={() => setConfirm("release")} disabled={busy}>
          Rilis
        </Btn>
      )}
      {canRefund && (
        <Btn variant="outline" size="sm" onClick={() => setConfirm("refund")} disabled={busy}>
          Refund
        </Btn>
      )}

      <ConfirmDialog
        open={confirm !== null}
        danger={confirm === "refund"}
        title={confirm === "release" ? "Rilis escrow?" : "Refund transaksi?"}
        body={
          confirm === "release"
            ? "Dana akan diteruskan & akses anggota dirilis. Tindakan ini tidak bisa dibatalkan."
            : "Dana dikembalikan ke saldo user, keanggotaan dibatalkan, dan slot dibebaskan. Tidak bisa dibatalkan."
        }
        busy={busy}
        onConfirm={() => run(confirm)}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}
