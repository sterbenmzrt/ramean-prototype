"use client";

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  // refetchOnWindowFocus dimatikan: default-nya memicu /api/auth/session tiap
  // jendela kembali fokus (sumber utama hit berulang). Login/logout di tab ini
  // tetap memperbarui session lewat event NextAuth, tanpa polling.
  return (
    <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>
  );
}
