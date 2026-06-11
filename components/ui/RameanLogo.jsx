// RameanLogo — port dari prototype shared.jsx.
export default function RameanLogo({ size = 32, dark = false }) {
  return (
    <div className="flex items-center gap-[9px] cursor-pointer select-none">
      <img
        src="/assets/logo.png"
        width={size}
        height={size}
        alt="Ramean.id"
        className="rounded-full shrink-0 block"
      />
      <span
        className="font-heading font-bold leading-none tracking-[-0.3px]"
        style={{ fontSize: Math.round(size * 0.65), color: dark ? "#FFFFFF" : "#0F172A" }}
      >
        ramean
        <span style={{ color: dark ? "#FBDA7B" : "#03346E" }}>.id</span>
      </span>
    </div>
  );
}
