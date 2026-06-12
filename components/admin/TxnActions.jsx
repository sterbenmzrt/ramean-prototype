"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Btn from "@/components/ui/Btn";

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
    <div className="flex gap-2 items-center">
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

      {confirm && (
        <div
          className="fixed inset-0 z-[300] bg-black/40 flex items-center justify-center px-5"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirm(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-[380px] w-full text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-heading font-bold text-lg text-text mb-2">
              {confirm === "release" ? "Rilis escrow?" : "Refund transaksi?"}
            </h3>
            <p className="text-[13px] text-text-md font-body mb-6 leading-relaxed">
              {confirm === "release"
                ? "Dana akan diteruskan & akses anggota dirilis. Tindakan ini tidak bisa dibatalkan."
                : "Dana dikembalikan ke saldo user, keanggotaan dibatalkan, dan slot dibebaskan. Tidak bisa dibatalkan."}
            </p>
            <div className="flex gap-2 justify-center">
              <Btn variant="ghost" size="md" onClick={() => setConfirm(null)} disabled={busy}>
                Batal
              </Btn>
              <Btn
                variant={confirm === "refund" ? "danger" : "primary"}
                size="md"
                onClick={() => run(confirm)}
                disabled={busy}
              >
                {busy ? "Memproses…" : "Ya, lanjutkan"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
