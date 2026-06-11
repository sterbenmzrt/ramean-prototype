// Btn — port dari prototype shared.jsx (Btn) ke class Tailwind, tampilan dijaga.
const SIZES = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-[22px] py-[11px] text-sm",
  lg: "px-7 py-[14px] text-[15px]",
};

const VARIANTS = {
  primary: "bg-primary text-white border border-primary",
  yellow: "bg-yellow text-text border border-[#E9C547]",
  outline: "bg-transparent text-text border border-border",
  outlinePrimary: "bg-transparent text-primary border border-primary",
  ghost: "bg-transparent text-text-md border border-transparent",
  outlineWhite: "bg-transparent text-white border border-white/50",
  muted: "bg-border-lt text-text-md border border-border",
  danger: "bg-err text-white border border-err",
  goldDk: "bg-yellow-dk text-white border border-yellow-dk",
};

export default function Btn({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  size = "md",
  full = false,
  className = "",
}) {
  const base =
    "font-body font-medium rounded-lg inline-flex items-center justify-center gap-2 whitespace-nowrap leading-none transition-all active:scale-[0.98] min-h-[44px]";
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        base,
        SIZES[size] || SIZES.md,
        VARIANTS[variant] || VARIANTS.primary,
        full ? "w-full" : "",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
