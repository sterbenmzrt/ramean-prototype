import { describe, it, expect } from "vitest";
import { setGroupCredential, getGroupCredentialForMember } from "@/lib/credential";
import { makeUser, makeService, makeGroup, addMember } from "./helpers.js";

// Gate kerahasiaan: kredensial terdekripsi hanya boleh keluar untuk anggota PAID.
describe("getGroupCredentialForMember", () => {
  it("non-anggota → not_member, tanpa kredensial", async () => {
    const svc = await makeService();
    const group = await makeGroup({ serviceId: svc.id });
    const outsider = await makeUser();
    await setGroupCredential(group.id, { email: "akun@netflix.id", password: "rahasia123" });

    const res = await getGroupCredentialForMember(group.id, outsider.id);
    expect(res.state).toBe("not_member");
    expect(res.credential).toBeNull();
  });

  it("anggota belum PAID → pending, tanpa kredensial", async () => {
    const svc = await makeService();
    const group = await makeGroup({ serviceId: svc.id });
    const user = await makeUser();
    await addMember(group.id, user.id, "PENDING");
    await setGroupCredential(group.id, { email: "akun@netflix.id", password: "rahasia123" });

    const res = await getGroupCredentialForMember(group.id, user.id);
    expect(res.state).toBe("pending");
    expect(res.credential).toBeNull();
  });

  it("anggota PAID → ready + kredensial terdekripsi benar", async () => {
    const svc = await makeService();
    const group = await makeGroup({ serviceId: svc.id });
    const user = await makeUser();
    await addMember(group.id, user.id, "PAID");
    await setGroupCredential(group.id, {
      email: "akun@netflix.id",
      password: "rahasia123",
      note: "profil 2",
    });

    const res = await getGroupCredentialForMember(group.id, user.id);
    expect(res.state).toBe("ready");
    expect(res.credential).toEqual({
      email: "akun@netflix.id",
      password: "rahasia123",
      note: "profil 2",
    });
  });

  it("anggota PAID tapi kredensial belum diisi → not_ready", async () => {
    const svc = await makeService();
    const group = await makeGroup({ serviceId: svc.id });
    const user = await makeUser();
    await addMember(group.id, user.id, "PAID");

    const res = await getGroupCredentialForMember(group.id, user.id);
    expect(res.state).toBe("not_ready");
    expect(res.credential).toBeNull();
  });
});
