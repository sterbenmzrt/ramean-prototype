"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, getProviders } from "next-auth/react";
import Link from "next/link";
import RameanLogo from "@/components/ui/RameanLogo";
import Btn from "@/components/ui/Btn";
import Field, { inputClass } from "@/components/ui/Field";
import { EyeIcon, EyeOffIcon, GoogleIcon } from "@/components/ui/icons";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="bg-bg min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  // Hanya terima path internal relatif (anti open-redirect: tolak absolut & //host).
  const rawCallback = searchParams.get("callbackUrl");
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/marketplace";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    getProviders().then((p) => setGoogleEnabled(Boolean(p?.google)));
  }, []);

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
    // Hard navigation, bukan router.push: memastikan cookie sesi terkirim ke server
    // sebelum halaman terproteksi (mis. checkout) di-render ulang. Tetap loading
    // karena halaman akan berpindah.
    window.location.assign(callbackUrl);
  }

  return (
    <div className="page-anim bg-bg min-h-screen flex flex-col items-center justify-center px-5 py-10">
      <Link href="/" className="mb-7">
        <RameanLogo size={36} />
      </Link>

      <div className="w-full max-w-[440px] bg-white border border-border rounded-[14px] px-10 py-9">
        <h1 className="font-heading font-bold text-[26px] text-text mb-1.5 text-center">
          Selamat datang kembali
        </h1>
        <p className="text-text-md text-sm mb-7 leading-relaxed text-center font-body">
          Masukkan kredensialmu untuk melanjutkan.
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
              placeholder="email@kamu.com"
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

        {googleEnabled && (
          <>
            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-text-sm font-body">atau</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <Btn
              variant="outline"
              full
              size="lg"
              onClick={() => signIn("google", { callbackUrl })}
            >
              <GoogleIcon /> Lanjut dengan Google
            </Btn>
          </>
        )}

        <div className="mt-4 text-center">
          <span className="text-[13px] text-text-md font-body">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary font-semibold no-underline">
              Daftar gratis
            </Link>
          </span>
        </div>
      </div>

      <div className="mt-6 text-xs text-text-sm font-body">© 2026 Ramean</div>
    </div>
  );
}
