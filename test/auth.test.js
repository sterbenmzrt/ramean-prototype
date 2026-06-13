import { describe, it, expect, vi } from "vitest";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeUser } from "./helpers.js";

const { jwt, session } = authOptions.callbacks;

describe("jwt callback — beban DB", () => {
  it("saat login (user hadir) → embed uid/role dari DB", async () => {
    const u = await makeUser({ role: "ADMIN" });
    const token = await jwt({ token: { email: u.email }, user: { email: u.email } });
    expect(token.uid).toBe(u.id);
    expect(token.role).toBe("ADMIN");
  });

  it("pembacaan session berikutnya (tanpa user) → tidak query DB", async () => {
    const u = await makeUser();
    const spy = vi.spyOn(prisma.user, "findUnique");
    const token = await jwt({
      token: { email: u.email, uid: u.id, role: "USER" },
    });
    expect(spy).not.toHaveBeenCalled();
    expect(token.uid).toBe(u.id); // tetap dari cache token
    spy.mockRestore();
  });

  it("session callback memetakan uid/role token ke session.user", async () => {
    const out = await session({
      session: { user: { name: "X" } },
      token: { uid: "abc", role: "ADMIN" },
    });
    expect(out.user.id).toBe("abc");
    expect(out.user.role).toBe("ADMIN");
  });
});
