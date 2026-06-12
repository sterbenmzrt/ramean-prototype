"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import RameanLogo from "@/components/ui/RameanLogo";
import Btn from "@/components/ui/Btn";
import Field, { inputClass } from "@/components/ui/Field";
import { EyeIcon, EyeOffIcon, LockIcon } from "@/components/ui/icons";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-primary" />}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const searchParams = useSearchParams();
  // Admin login hanya mendarat di area /admin (anti open-redirect).
  const raw = searchParams.get("callbackUrl");
  const callbackUrl = raw && raw.startsWith("/admin") ? raw : "/admin";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    if (result?.error) {
      setError("Email atau password salah.");
      setLoading(false);
      return;
    }
    // Hard navigation agar cookie sesi terkirim sebelum guard /admin dievaluasi.
    window.location.assign(callbackUrl);
  }

  return (
    <div className="min-h-[100dvh] flex max-md:flex-col">
      {/* KIRI — panel navy + logo */}
      <div className="w-[42%] bg-primary flex flex-col justify-between p-12 max-lg:w-[38%] max-md:w-full max-md:p-8 max-md:min-h-[180px]">
        <RameanLogo size={36} dark />
        <div className="max-md:hidden">
          <h2 className="font-heading font-extrabold text-white text-[32px] leading-tight mb-3">
            Panel Admin
          </h2>
          <p className="text-white/70 text-sm font-body leading-relaxed max-w-[320px]">
            Kelola grup, transaksi, dan escrow Ramean. Akses khusus administrator.
          </p>
        </div>
        <div className="text-white/50 text-xs font-body max-md:hidden">© 2026 Ramean</div>
      </div>

      {/* KANAN — form kredensial putih */}
      <div className="flex-1 bg-white flex items-center justify-center p-12 max-md:p-8">
        <div className="w-full max-w-[380px]">
          <span className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-[#EEF2FF] text-primary text-xs font-semibold font-body">
            <LockIcon width={14} height={14} /> Area Admin
          </span>
          <h1 className="font-heading font-bold text-[26px] text-text mb-1.5">
            Masuk sebagai Admin
          </h1>
          <p className="text-text-md text-sm mb-7 leading-relaxed font-body">
            Masukkan kredensial administrator untuk mengelola Ramean.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-5 px-4 py-3 rounded-lg bg-err-bg border border-[#FCA5A5] text-err text-[13px] font-body"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Field label="Email" htmlFor="email">
              <input
                id="email"
                value={form.email}
                onChange={(e) => up("email", e.target.value)}
                placeholder="admin@ramean.id"
                type="email"
                aria-invalid={Boolean(error)}
                className={inputClass}
              />
            </Field>

            <Field label="Password" htmlFor="password">
              <div className="relative">
                <input
                  id="password"
                  value={form.password}
                  onChange={(e) => up("password", e.target.value)}
                  placeholder="••••••••"
                  type={showPw ? "text" : "password"}
                  aria-invalid={Boolean(error)}
                  className={inputClass + " pr-12"}
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

            <Btn type="submit" variant="primary" full size="lg" disabled={loading}>
              {loading ? "Memproses…" : "Masuk"}
            </Btn>
          </form>
        </div>
      </div>
    </div>
  );
}
