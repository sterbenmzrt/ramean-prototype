// Kartu KPI untuk dashboard admin. Label + nilai + ikon (teks + ikon, bukan warna saja).

export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-xs text-text-md font-body mb-1">{label}</div>
        <div className="font-heading font-extrabold text-2xl text-text truncate">{value}</div>
      </div>
      <span className="w-9 h-9 rounded-lg bg-[#EEF2FF] text-primary flex items-center justify-center shrink-0">
        {icon}
      </span>
    </div>
  );
}
