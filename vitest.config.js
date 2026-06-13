import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Test integrasi logika bisnis (uang/escrow/gate kredensial) terhadap SQLite test-db
// terpisah. BUKAN test UI — yang dijaga adalah korektnya alur server, bukan tampilan.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    globalSetup: "./test/globalSetup.js",
    setupFiles: ["./test/setup.js"],
    // DB SQLite dipakai bersama antar test → jalankan serial agar tak saling balap.
    fileParallelism: false,
    env: {
      DATABASE_URL: "file:./test.db",
      CREDENTIAL_ENC_KEY: "gdcvAcjUtNHSN6LOtoBOGWZZAAyvq0EMd4pJ6drTkEk=",
      NEXTAUTH_SECRET: "test-secret",
    },
  },
});
