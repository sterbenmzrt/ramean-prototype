import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AccountSidebar from "@/components/account/AccountSidebar";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/akun");

  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-[1100px] mx-auto px-10 py-10 grid grid-cols-[230px_1fr] gap-8 items-start max-md:grid-cols-1 max-md:px-5 max-md:gap-5">
        <AccountSidebar name={session.user.name} email={session.user.email} />
        <div>{children}</div>
      </div>
    </div>
  );
}
