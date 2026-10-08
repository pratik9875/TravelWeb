import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { logout } from "../actions";

async function Gate({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  return (
    <>
      <header className="flex items-center justify-between mb-6">
        <Link href="/admin" className="font-bold">
          TravelStay admin
        </Link>
        <form action={logout} className="flex items-center gap-3 text-sm">
          <span className="text-gray-600">{user.email}</span>
          <button className="underline">Log out</button>
        </form>
      </header>
      {children}
    </>
  );
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <Suspense fallback={<p>Loading...</p>}>
        <Gate>{children}</Gate>
      </Suspense>
    </main>
  );
}
