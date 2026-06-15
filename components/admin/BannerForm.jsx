"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Btn from "@/components/ui/Btn";
import Field, { inputClass } from "@/components/ui/Field";

// mode: "create" | "edit". uploadEnabled=false (mis. produksi) → input gambar
// disembunyikan, banner dibuat tanpa gambar (fallback blank).
export default function BannerForm({ mode, initial = null, uploadEnabled = true }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title || "",
    subtitle: initial?.subtitle || "",
    ctaLabel: initial?.ctaLabel || "",
    ctaHref: initial?.ctaHref || "",
    order: initial?.order ?? 0,
    active: initial?.active ?? true,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.imagePath || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function onFile(e) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (uploadEnabled && mode === "create" && !file) {
      setError("Gambar wajib diunggah.");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subtitle", form.subtitle);
    fd.append("ctaLabel", form.ctaLabel);
    fd.append("ctaHref", form.ctaHref);
    fd.append("order", String(form.order));
    fd.append("active", String(form.active));
    if (file) fd.append("image", file);
    if (mode === "edit") fd.append("id", initial.id);

    const res = await fetch("/api/admin/banner", {
      method: mode === "edit" ? "PATCH" : "POST",
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Gagal menyimpan.");
      setLoading(false);
      return;
    }
    router.push("/admin/banner");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="max-w-[520px] bg-white border border-border rounded-xl p-6" noValidate>
      {error && (
        <div role="alert" className="mb-5 px-4 py-3 rounded-lg bg-err-bg border border-[#FCA5A5] text-err text-[13px] font-body">
          {error}
        </div>
      )}

      <Field label="Judul" htmlFor="title">
        <input id="title" value={form.title} onChange={(e) => up("title", e.target.value)} className={inputClass} />
      </Field>
      <Field label="Subjudul (opsional)" htmlFor="subtitle">
        <input id="subtitle" value={form.subtitle} onChange={(e) => up("subtitle", e.target.value)} className={inputClass} />
      </Field>
      <Field label="Teks Tombol (opsional)" htmlFor="ctaLabel">
        <input id="ctaLabel" value={form.ctaLabel} onChange={(e) => up("ctaLabel", e.target.value)} className={inputClass} />
      </Field>
      <Field label="Link Tujuan (opsional)" htmlFor="ctaHref" hint="Contoh: /marketplace atau /service/xxxx">
        <input id="ctaHref" value={form.ctaHref} onChange={(e) => up("ctaHref", e.target.value)} className={inputClass} />
      </Field>
      <Field label="Urutan" htmlFor="order">
        <input id="order" type="number" min="0" value={form.order} onChange={(e) => up("order", e.target.value)} className={inputClass} />
      </Field>
      <Field label="Status" htmlFor="active">
        <select id="active" value={String(form.active)} onChange={(e) => up("active", e.target.value === "true")} className={inputClass}>
          <option value="true">Aktif</option>
          <option value="false">Nonaktif</option>
        </select>
      </Field>
      {uploadEnabled ? (
        <>
          <Field label={mode === "edit" ? "Ganti Gambar (opsional)" : "Gambar"} htmlFor="image" hint="JPG/PNG/WEBP, maks 2 MB">
            <input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} className={inputClass} />
          </Field>
          {preview && (
            <div className="mb-4">
              <img src={preview} alt="Pratinjau banner" className="w-full h-40 object-cover rounded-lg border border-border" />
            </div>
          )}
        </>
      ) : (
        <div className="mb-5 px-4 py-3 rounded-lg bg-warn-bg border border-warn/30 text-warn text-[13px] font-body">
          Upload gambar dinonaktifkan di lingkungan ini. Banner tetap dibuat, namun tampil sebagai
          placeholder (judul di atas latar gradient) sampai gambar tersedia.
        </div>
      )}

      <Btn type="submit" variant="primary" full size="lg" disabled={loading}>
        {loading ? "Menyimpan…" : mode === "edit" ? "Simpan Perubahan" : "Buat Banner"}
      </Btn>
    </form>
  );
}
