"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SvcIcon from "@/components/ui/SvcIcon";
import Btn from "@/components/ui/Btn";
import { CheckIcon, ShieldIcon, ArrowLeftIcon } from "@/components/ui/icons";
import { fmt } from "@/lib/tokens";

export default function CheckoutClient({ group, adminFee, walletBalance, alreadyMember }) {
  const router = useRouter();
  const svc = group.service;
  const price = group.pricePerSlot;
  const total = price + adminFee;
  const discount = svc.originalPrice - price;

  const [method, setMethod] = useState("saldo");
  const [step, setStep] = useState(alreadyMember ? "already" : "form");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const payMethods = [
    { id: "saldo", lbl: "Saldo Ramean", sub: `Saldo kamu: ${fmt(walletBalance)}` },
    { id: "qris", lbl: "QRIS", sub: "Simulasi demo — pembayaran tidak diproses" },
    { id: "bca", lbl: "Transfer BCA", sub: "Simulasi demo — pembayaran tidak diproses" },
    { id: "gopay", lbl: "GoPay", sub: "Simulasi demo — pembayaran tidak diproses" },
  ];

  async function confirm() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: group.id, method }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Pembayaran gagal. Coba lagi.");
        setLoading(false);
        return;
      }
      setStep("success");
    } catch {
      setError("Terjadi kesalahan jaringan. Coba lagi.");
      setLoading(false);
    }
  }

  // ── Sudah jadi anggota ──
  if (step === "already") {
    return (
      <Centered>
        <div className="w-20 h-20 rounded-full bg-[#EEF2FF] flex items-center justify-center mx-auto mb-6 text-primary">
          <CheckIcon width={36} height={36} />
        </div>
        <h2 className="font-heading font-extrabold text-[26px] text-text mb-3">
          Kamu sudah di grup ini
        </h2>
        <p className="text-text-md text-[15px] leading-relaxed mb-8 font-body">
          Kamu sudah tergabung di grup <strong>{svc.name}</strong> ini. Langsung saja masuk ke
          lobby untuk melihat info grup.
        </p>
        <Link href={`/lobby/${group.id}`}>
          <Btn variant="primary" full size="lg">Masuk ke Lobby</Btn>
        </Link>
      </Centered>
    );
  }

  // ── Success ──
  if (step === "success") {
    return (
      <Centered>
        <div className="w-20 h-20 rounded-full bg-ok-bg flex items-center justify-center mx-auto mb-6 text-ok">
          <CheckIcon width={40} height={40} />
        </div>
        <h2 className="font-heading font-extrabold text-[28px] text-text mb-3">
          Pesanan Dikonfirmasi!
        </h2>
        <p className="text-text-md text-[15px] leading-[1.75] mb-2 font-body">
          Kamu berhasil bergabung ke grup <strong>{svc.name}</strong>. Dana kamu ditahan di
          escrow Ramean dan diteruskan setelah akses terverifikasi.
        </p>
        <p className="text-text-sm text-[13px] mb-8 font-body">
          Detail akun akan tersedia di lobby grup.
        </p>
        <Link href={`/lobby/${group.id}`}>
          <Btn variant="primary" full size="lg">Masuk ke Lobby</Btn>
        </Link>
      </Centered>
    );
  }

  // ── Form (ringkasan + metode + escrow + konfirmasi) ──
  return (
    <div className="bg-bg min-h-screen px-10 py-13 max-md:px-5">
      <div className="max-w-[900px] mx-auto py-12">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-12">
          {["Pembayaran", "Selesai"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-extrabold text-[13px] ${
                    i === 0 ? "bg-primary text-white" : "bg-border text-text-sm"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-xs ${i === 0 ? "font-bold text-text" : "text-text-md"}`}>{s}</span>
              </div>
              {i === 0 && <div className="w-[100px] h-0.5 bg-border mx-4 mb-5" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_340px] gap-8 max-md:grid-cols-1">
          {/* LEFT */}
          <div className="bg-white rounded-xl border border-border p-9 max-md:p-6">
            <h2 className="font-heading font-bold text-[22px] text-text mb-7">Metode Pembayaran</h2>

            {error && (
              <div role="alert" className="mb-5 px-4 py-3 rounded-lg bg-err-bg border border-[#FCA5A5] text-err text-[13px] font-body">
                {error}
              </div>
            )}

            {payMethods.map((m) => {
              const insufficient = m.id === "saldo" && walletBalance < total;
              const selected = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className="w-full text-left px-4 py-4 rounded-[10px] cursor-pointer mb-2.5 flex items-center gap-3.5 transition-all"
                  style={{
                    border: `2px solid ${selected ? "#03346E" : "#E2E8F0"}`,
                    backgroundColor: selected ? "#EEF2FF" : "#FFFFFF",
                  }}
                >
                  <span
                    className="w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center"
                    style={{ border: `2px solid ${selected ? "#03346E" : "#D1D5DB"}` }}
                  >
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </span>
                  <span className="flex-1">
                    <span className="block font-bold text-sm text-text font-body">{m.lbl}</span>
                    <span className="block text-xs text-text-md font-body">
                      {m.sub}
                      {insufficient && (
                        <span className="text-err font-semibold"> · saldo kurang</span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}

            {/* Escrow reminder */}
            <div className="mt-5 px-4 py-3.5 rounded-[10px] bg-[#EEF2FF] flex gap-3 items-start">
              <span className="text-primary shrink-0 mt-0.5">
                <ShieldIcon width={18} height={18} />
              </span>
              <div>
                <div className="text-[13px] font-bold text-primary font-body mb-1">
                  Dilindungi Escrow Ramean
                </div>
                <div className="text-xs text-text-md font-body leading-relaxed">
                  Dana kamu ditahan di rekening bersama Ramean dan baru diteruskan ke pemilik
                  akun setelah kamu berhasil login dan memverifikasi akses. Aman dari penipuan.
                </div>
              </div>
            </div>

            <div className="mt-7 flex gap-2.5">
              <Link href={`/service/${svc.id}`}>
                <Btn variant="ghost" size="md">
                  <ArrowLeftIcon width={16} height={16} /> Kembali
                </Btn>
              </Link>
              <Btn variant="primary" full size="lg" onClick={confirm} disabled={loading}>
                {loading ? "Memproses…" : "Konfirmasi Pembayaran"}
              </Btn>
            </div>
          </div>

          {/* RIGHT — ringkasan */}
          <div className="sticky top-[88px] max-md:static">
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-heading font-bold text-[15px] text-text mb-5">Ringkasan Pesanan</h3>

              <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-border-lt">
                <SvcIcon name={svc.name} logoUrl={svc.logoUrl} size={44} />
                <div>
                  <div className="font-bold text-sm text-text font-body">{svc.name}</div>
                  <div className="text-xs text-text-md mt-0.5 font-body">1 slot · per bulan</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                <Row label="Harga normal" value={fmt(svc.originalPrice)} strike />
                <Row label="Diskon via Ramean" value={"- " + fmt(discount)} green />
                <Row label="Harga per slot" value={fmt(price)} />
                <Row label="Biaya admin" value={fmt(adminFee)} />
              </div>

              <div className="border-t border-border pt-3.5 mb-4 flex justify-between items-center">
                <span className="font-bold text-[15px] text-text font-body">Total Bayar</span>
                <span className="font-heading font-extrabold text-xl text-primary">{fmt(total)}</span>
              </div>

              <div className="bg-ok-bg rounded-lg px-3.5 py-2.5">
                <span className="text-xs text-ok font-semibold leading-relaxed font-body">
                  Kamu hemat {fmt(discount)} dari harga normal!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Centered({ children }) {
  return (
    <div className="bg-bg min-h-screen flex items-center justify-center px-10 py-10">
      <div className="bg-white rounded-3xl border border-border px-13 py-16 max-w-[480px] w-full text-center max-md:px-8"
        style={{ boxShadow: "0 8px 48px rgba(13,27,53,0.1)" }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, strike, green }) {
  return (
    <div className="flex justify-between text-[13px] font-body">
      <span className="text-text-md">{label}</span>
      <span
        className={green ? "text-ok font-semibold" : "text-text"}
        style={strike ? { textDecoration: "line-through", color: "#94A3B8" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
