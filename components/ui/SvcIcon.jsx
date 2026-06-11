// SvcIcon — logo layanan dari DB; fallback ke inisial berwarna bila logoUrl kosong
// (mis. Spotify belum punya aset) → anti broken-image (lihat DoD CLAUDE.md).
const FALLBACK_COLORS = {
  S: "#1DB954", // Spotify-ish hijau
  default: "#03346E",
};

export default function SvcIcon({ name, logoUrl, size = 44 }) {
  const radius = Math.round(size * 0.2);
  if (logoUrl) {
    return (
      <div
        className="bg-white flex items-center justify-center shrink-0 border border-border overflow-hidden"
        style={{ width: size, height: size, borderRadius: radius, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        <img
          src={logoUrl}
          alt={name}
          className="object-contain block"
          style={{ width: "65%", height: "65%" }}
        />
      </div>
    );
  }
  const initial = (name || "?").charAt(0).toUpperCase();
  const color = FALLBACK_COLORS[initial] || FALLBACK_COLORS.default;
  return (
    <div
      className="flex items-center justify-center shrink-0 font-heading font-bold text-white"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: color,
        fontSize: Math.round(size * 0.42),
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
