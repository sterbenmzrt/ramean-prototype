// Ramean.id — Design tokens (porting objek `C` dari prototype shared.jsx).
// Dipakai untuk style dinamis yang tidak praktis lewat class Tailwind.
// Tailwind config (tailwind.config.js) men-sumber warna dari sini.
export const C = {
  primary: "#03346E",
  yellow: "#FBDA7B",
  yellowDk: "#C8911C",
  astral: "#3674B5",
  bg: "#F8F9FB",
  white: "#FFFFFF",
  text: "#0F172A",
  textMd: "#475569",
  textSm: "#94A3B8",
  border: "#E2E8F0",
  borderLt: "#F1F5F9",
  ok: "#059669",
  okBg: "#ECFDF5",
  err: "#DC2626",
  errBg: "#FEF2F2",
  warn: "#B45309",
  warnBg: "#FEF3C7",
};

export const fmt = (n) => "Rp" + Number(n || 0).toLocaleString("id-ID");
