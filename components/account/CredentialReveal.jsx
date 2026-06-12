"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from "@/components/ui/icons";

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard tidak tersedia — abaikan */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Salin ${label}`}
      className="h-9 px-2.5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white text-text-md text-xs font-body cursor-pointer shrink-0 hover:bg-bg"
    >
      {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon />}
      {copied ? "Tersalin" : "Salin"}
    </button>
  );
}

function Row({ label, value, children }) {
  return (
    <div className="flex items-center gap-2 py-2.5 border-t border-border-lt first:border-t-0">
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-text-sm font-body uppercase tracking-wide mb-0.5">{label}</div>
        <div className="text-[14px] text-text font-body font-medium break-all">{value}</div>
      </div>
      {children}
    </div>
  );
}

export default function CredentialReveal({ credential }) {
  const [show, setShow] = useState(false);
  const { email, password, note } = credential;

  return (
    <div>
      <Row label="Email / Username" value={email}>
        <CopyButton value={email} label="email" />
      </Row>

      <Row label="Password" value={show ? password : "•".repeat(Math.min(password.length || 8, 12))}>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-border bg-white text-text-md cursor-pointer shrink-0 hover:bg-bg"
        >
          {show ? <EyeOffIcon width={16} height={16} /> : <EyeIcon width={16} height={16} />}
        </button>
        <CopyButton value={password} label="password" />
      </Row>

      {note && <Row label="Catatan" value={note} />}
    </div>
  );
}
