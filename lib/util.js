// Anonimisasi nama anggota grup (port dari DetailPage.obfuscateName).
export function obfuscateName(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => {
      if (part.length <= 2) return part;
      return part[0] + "*".repeat(Math.min(part.length - 1, 6)) + part[part.length - 1];
    })
    .join(" ");
}

export function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}
