import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { initials } from "@/lib/util";

export const dynamic = "force-dynamic";

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true },
  });

  const rows = [
    ["Nama", user.name],
    ["Email", user.email],
    ["Bergabung sejak", formatDate(user.createdAt)],
  ];

  return (
    <div>
      <div className="text-[11px] font-semibold text-text-sm tracking-[0.07em] uppercase font-body mb-1">
        Akun
      </div>
      <h1 className="font-heading font-bold text-[22px] text-text mb-6">Profil</h1>

      <div className="bg-white border border-border rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border-lt">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-2xl shrink-0">
            {initials(user.name)}
          </div>
          <div>
            <div className="font-heading font-bold text-lg text-text">{user.name}</div>
            <div className="text-[13px] text-text-md font-body">{user.email}</div>
          </div>
        </div>

        {rows.map(([k, v], i) => (
          <div
            key={k}
            className={`flex justify-between items-center py-3 ${
              i > 0 ? "border-t border-border-lt" : ""
            }`}
          >
            <span className="text-[13px] text-text-md font-body">{k}</span>
            <span className="text-[13px] font-semibold text-text font-body text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
