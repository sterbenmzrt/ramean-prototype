// Tag / Badge — port dari prototype shared.jsx.
const VARIANTS = {
  primary: "bg-[#EEF2FF] text-primary",
  yellow: "bg-[#FEF9C3] text-[#92400E]",
  green: "bg-ok-bg text-ok",
  red: "bg-err-bg text-err",
  warn: "bg-warn-bg text-warn",
  muted: "bg-border-lt text-text-md",
};

export default function Tag({ children, variant = "primary" }) {
  return (
    <span
      className={`inline-block px-2.5 py-[3px] rounded-full text-xs font-medium font-body whitespace-nowrap ${
        VARIANTS[variant] || VARIANTS.primary
      }`}
    >
      {children}
    </span>
  );
}
