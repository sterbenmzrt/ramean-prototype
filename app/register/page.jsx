"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import RameanLogo from "@/components/ui/RameanLogo";
import Btn from "@/components/ui/Btn";
import Field, { inputClass } from "@/components/ui/Field";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const pwMatch = form.confirm === "" || form.password === form.confirm;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Nama minimal 2 karakter.");
    if (form.password.length < 8) return setError("Password minimal 8 karakter.");
    if (form.password !== form.confirm) return setError("Password tidak cocok.");

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal. Coba lagi.");
        setLoading(false);
        return;
      }
      // Auto-login setelah daftar.
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      if (result?.error) {
        setError("Akun dibuat, tapi login otomatis gagal. Silakan masuk manual.");
        setLoading(false);
        router.push("/login");
        return;
      }
      router.push("/marketplace");
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-bg min-h-screen flex flex-col items-center justify-center px-5 py-10">
      <Link href="/" className="mb-7">
        <RameanLogo size={36} />
      </Link>

      <div className="w-full max-w-[480px] bg-white border border-border rounded-[14px] px-10 py-9">
        <h1 className="font-heading font-bold text-[26px] text-text mb-1.5 text-center">
          Buat Akun Ramean
        </h1>
        <p className="text-text-md text-sm mb-7 leading-relaxed text-center font-body">
          Daftar gratis dan mulai hemat bersama Ramean.
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
          <Field label="Nama Lengkap" htmlFor="name">
            <input
              id="name"
              value={form.name}
              onChange={(e) => up("name", e.target.value)}
              placeholder="Nama Lengkap"
              className={inputClass}
            />
          </Field>

          <Field
            label="Nomor WhatsApp"
            htmlFor="phone"
            hint="Kami kirim detail akun via WhatsApp"
          >
            <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white">
              <div className="px-2.5 py-[11px] bg-[#F8FAFC] border-r border-border text-[13px] text-text font-body whitespace-nowrap flex items-center gap-[6px]">
                <span aria-hidden className="inline-flex h-[13px] w-5 overflow-hidden rounded-sm border border-border">
                  <span className="h-full w-1/2 bg-[#E70011]" />
                  <span className="h-full w-1/2 bg-white" />
                </span>
                <span className="font-semibold">+62</span>
              </div>
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => up("phone", e.target.value.replace(/\D/g, ""))}
                placeholder="8xxxxxxxxxx"
                type="tel"
                inputMode="numeric"
                className="border-none rounded-none flex-1 px-2.5 py-[11px] text-sm outline-none font-body text-text bg-white"
              />
            </div>
          </Field>

          <Field label="Email" htmlFor="email">
            <input
              id="email"
              value={form.email}
              onChange={(e) => up("email", e.target.value)}
              placeholder="email@kamu.com"
              type="email"
              className={inputClass}
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <div className="relative">
              <input
                id="password"
                value={form.password}
                onChange={(e) => up("password", e.target.value)}
                placeholder="Min. 8 karakter"
                type={showPw ? "text" : "password"}
                className={inputClass + " pr-10"}
              />
              <button
                type="button"
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-text-md inline-flex"
              >
                {showPw ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </Field>

          <Field
            label="Konfirmasi Password"
            htmlFor="confirm"
            error={!pwMatch ? "Password tidak cocok" : ""}
          >
            <div className="relative">
              <input
                id="confirm"
                value={form.confirm}
                onChange={(e) => up("confirm", e.target.value)}
                placeholder="Ulangi password"
                type={showConfirm ? "text" : "password"}
                className={inputClass + " pr-10"}
                style={{
                  borderColor: !pwMatch
                    ? "#FCA5A5"
                    : form.confirm && pwMatch
                    ? "#86EFAC"
                    : undefined,
                }}
              />
              <button
                type="button"
                aria-label={showConfirm ? "Sembunyikan password" : "Tampilkan password"}
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-text-md inline-flex"
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </Field>

          <div className="text-xs text-text-md font-body mb-5 leading-relaxed text-center">
            Dengan mendaftar, kamu menyetujui{" "}
            <span className="text-primary font-medium">Syarat &amp; Ketentuan</span>{" "}
            dan{" "}
            <span className="text-primary font-medium">Kebijakan Privasi</span>{" "}
            Ramean.
          </div>

          <Btn type="submit" variant="primary" full size="lg" disabled={loading}>
            {loading ? "Memproses…" : "Daftar Sekarang"}
          </Btn>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[13px] text-text-md font-body">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary font-semibold no-underline">
              Masuk
            </Link>
          </span>
        </div>
      </div>

      <div className="mt-6 text-xs text-text-sm font-body">© 2026 Ramean</div>
    </div>
  );
}
