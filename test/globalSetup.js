import { execSync } from "node:child_process";

// Buat skema di test-db sekali sebelum semua test. --force-reset menjamin skema
// fresh tiap run; --skip-generate karena client sudah ter-generate dari build.
export default function setup() {
  execSync("npx prisma db push --skip-generate --force-reset", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: "file:./test.db" },
  });
}
