"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Btn from "@/components/ui/Btn";
import Field, { inputClass } from "@/components/ui/Field";

// mode: "create" | "edit". services hanya dipakai saat create.
export default function GroupForm({ mode, services = [], initial = null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    serviceId: initial?.serviceId || services[0]?.id || "",
    totalSlots: initial?.totalSlots ?? 5,
    pricePerSlot: initial?.pricePerSlot ?? 15000,
    status: initial?.status || "AVAILABLE",
    renewalDate: initial ? new Date(initial.renewalDate).toISOString().slice(0, 10) : "",
    hostName: initial?.hostName || "Ramean Official",
    rules: initial?.rules || "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const up = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const isEdit = mode === "edit";
    const payload = isEdit
      ? {
          id: initial.id,
          totalSlots: Number(form.totalSlots),
          pricePerSlot: Number(form.pricePerSlot),
          status: form.status,
          renewalDate: form.renewalDate,
          rules: form.rules,
        }
      : {
          serviceId: form.serviceId,
          totalSlots: Number(form.totalSlots),
          pricePerSlot: Number(form.pricePerSlot),
          renewalDate: form.renewalDate,
          hostName: form.hostName,
          rules: form.rules,
        };
    const res = await fetch("/api/admin/group", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Gagal menyimpan.");
      setLoading(false);
      return;
    }
    // Menuju cockpit grup terkait (grup baru untuk create, grup ini untuk edit).
    router.push(`/admin/group/${isEdit ? initial.id : data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="max-w-[520px] bg-white border border-border rounded-xl p-6" noValidate>
      {error && (
        <div role="alert" className="mb-5 px-4 py-3 rounded-lg bg-err-bg border border-[#FCA5A5] text-err text-[13px] font-body">
          {error}
        </div>
      )}

      {mode === "create" ? (
        <Field label="Layanan" htmlFor="serviceId">
          <select id="serviceId" value={form.serviceId} onChange={(e) => up("serviceId", e.target.value)} className={inputClass}>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </Field>
      ) : (
        <Field label="Status" htmlFor="status">
          <select id="status" value={form.status} onChange={(e) => up("status", e.target.value)} className={inputClass}>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="FULL">FULL</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </Field>
      )}

      <Field label="Total Slot" htmlFor="totalSlots">
        <input id="totalSlots" type="number" min="1" value={form.totalSlots} onChange={(e) => up("totalSlots", e.target.value)} className={inputClass} />
      </Field>
      <Field label="Harga / Slot (Rp)" htmlFor="pricePerSlot">
        <input id="pricePerSlot" type="number" min="1" value={form.pricePerSlot} onChange={(e) => up("pricePerSlot", e.target.value)} className={inputClass} />
      </Field>
      <Field label="Tanggal Perpanjangan" htmlFor="renewalDate">
        <input id="renewalDate" type="date" value={form.renewalDate} onChange={(e) => up("renewalDate", e.target.value)} className={inputClass} />
      </Field>
      {mode === "create" && (
        <Field label="Host" htmlFor="hostName">
          <input id="hostName" value={form.hostName} onChange={(e) => up("hostName", e.target.value)} className={inputClass} />
        </Field>
      )}
      <Field label="Aturan" htmlFor="rules">
        <input id="rules" value={form.rules} onChange={(e) => up("rules", e.target.value)} className={inputClass} />
      </Field>

      <Btn type="submit" variant="primary" full size="lg" disabled={loading}>
        {loading ? "Menyimpan…" : mode === "edit" ? "Simpan Perubahan" : "Buat Grup"}
      </Btn>
    </form>
  );
}
