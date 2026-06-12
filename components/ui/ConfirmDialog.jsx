"use client";

import { useEffect, useRef } from "react";
import Btn from "@/components/ui/Btn";

// Modal konfirmasi reusable. A11y: role=dialog, aria-modal, fokus pindah ke panel
// saat buka (bukan ke tombol destruktif), tutup via Escape & klik-luar.
export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Ya, lanjutkan",
  danger = false,
  busy = false,
  onConfirm,
  onClose,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/40 flex items-center justify-center px-5"
      onClick={() => !busy && onClose()}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-white rounded-2xl p-6 max-w-[380px] w-full text-center outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-heading font-bold text-lg text-text mb-2">{title}</h3>
        <p className="text-[13px] text-text-md font-body mb-6 leading-relaxed">{body}</p>
        <div className="flex gap-2 justify-center">
          <Btn variant="ghost" size="md" onClick={onClose} disabled={busy}>
            Batal
          </Btn>
          <Btn variant={danger ? "danger" : "primary"} size="md" onClick={onConfirm} disabled={busy}>
            {busy ? "Memproses…" : confirmLabel}
          </Btn>
        </div>
      </div>
    </div>
  );
}
