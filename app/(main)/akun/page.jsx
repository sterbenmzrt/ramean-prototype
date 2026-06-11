import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMyGroups } from "@/lib/data";
import MyGroupCard from "@/components/account/MyGroupCard";
import Btn from "@/components/ui/Btn";

export const dynamic = "force-dynamic";

export default async function GrupSayaPage() {
  const session = await getServerSession(authOptions);
  const groups = await getMyGroups(session.user.id);

  return (
    <div>
      <div className="text-[11px] font-semibold text-text-sm tracking-[0.07em] uppercase font-body mb-1">
        Akun
      </div>
      <h1 className="font-heading font-bold text-[22px] text-text mb-1">Grup Saya</h1>
      <p className="text-[13px] text-text-md font-body mb-6">
        Semua patungan yang kamu ikuti. Klik untuk masuk lobby grup.
      </p>

      {groups.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-10 text-center">
          <p className="text-sm text-text-md font-body mb-5">
            Kamu belum bergabung ke grup mana pun.
          </p>
          <Link href="/marketplace">
            <Btn variant="primary" size="md">
              Jelajahi Katalog
            </Btn>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((g, i) => (
            <MyGroupCard key={g.subscriptionId} g={g} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
