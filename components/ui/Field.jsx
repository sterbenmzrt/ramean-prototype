// Field — wrapper input dengan label permanen + hint/error.
// PENTING: dideklarasikan di top-level modul (BUKAN di dalam render halaman) supaya
// instance input stabil antar render — mencegah bug "cursor lepas saat typing"
// (lihat CLAUDE.md baris 59).
export default function Field({ label, htmlFor, children, hint, error }) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="block font-medium text-[13px] text-text mb-1.5 font-body"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <div className="text-[11px] text-text-sm mt-[5px] font-body">{hint}</div>
      )}
      {error && (
        <div className="text-[11px] text-err mt-[5px] font-body">{error}</div>
      )}
    </div>
  );
}

// Kelas input standar, dipakai konsisten di form auth.
export const inputClass =
  "w-full px-3.5 py-[11px] rounded-lg border border-border text-sm outline-none " +
  "font-body box-border text-text bg-white transition-colors";
