"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Btn from "@/components/ui/Btn";
import Field, { inputClass } from "@/components/ui/Field";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Write-only: form mengisi/mengganti kredensial. Plaintext lama tidak ditampilkan;
// hanya status tersimpan + tanggal.
export default function CredentialForm({ groupId, meta }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", note: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setOk(false);
    setLoading(true);
    const res = await fetch("/api/admin/credential", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, ...form }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Gagal menyimpan kredensial.");
      return;
    }
    setForm({ email: "", password: "", note: "" });
    setShowPw(false);
    setOk(true);
    router.refresh();
  }

  return (
    <div className="bg-white border border-border rounded-xl p-6 max-w-[520px]">
      <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
        <h2 className="font-heading font-bold text-lg text-text">Kredensial Akun</h2>
        {meta?.exists ? (
          <span className="text-[12px] text-ok font-semibold font-body">
            Tersimpan (terenkripsi) · diperbarui {formatDate(meta.updatedAt)}
          </span>
        ) : (
          <span className="text-[12px] text-text-sm font-body">Belum diisi</span>
        )}
      </div>
      <p className="text-[13px] text-text-md font-body mb-5 leading-relaxed">
        Kredensial dienkripsi sebelum disimpan dan hanya terlihat oleh anggota yang
        aksesnya sudah dirilis. Demi keamanan, nilai lama tidak ditampilkan — isi ulang
        untuk mengganti.
      </p>

      {error && (
        <div role="alert" className="mb-4 px-4 py-3 rounded-lg bg-err-bg border border-[#FCA5A5] text-err text-[13px] font-body">
          {error}
        </div>
      )}
      {ok && (
        <div role="status" className="mb-4 px-4 py-3 rounded-lg bg-ok-bg text-ok text-[13px] font-body">
          Kredensial tersimpan.
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <Field label="Email / Username akun" htmlFor="cred-email">
          <input
            id="cred-email"
            value={form.email}
            onChange={(e) => up("email", e.target.value)}
            placeholder="akun@layanan.com"
            className={inputClass}
            autoComplete="off"
          />
        </Field>
        <Field label="Password akun" htmlFor="cred-password">
          <div className="relative">
            <input
              id="cred-password"
              value={form.password}
              onChange={(e) => up("password", e.target.value)}
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              className={inputClass + " pr-12"}
              autoComplete="off"
            />
            <button
              type="button"
              aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
              onClick={() => setShowPw(!showPw)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-11 w-11 flex items-center justify-center bg-none border-none cursor-pointer text-text-md"
            >
              {showPw ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </Field>
        <Field label="Catatan (opsional)" htmlFor="cred-note">
          <input
            id="cred-note"
            value={form.note}
            onChange={(e) => up("note", e.target.value)}
            placeholder="mis. profil 'Slot 2', PIN 1234"
            className={inputClass}
          />
        </Field>

        <Btn type="submit" variant="primary" size="lg" disabled={loading}>
          {loading ? "Menyimpan…" : meta?.exists ? "Ganti Kredensial" : "Simpan Kredensial"}
        </Btn>
      </form>
    </div>
  );
}
