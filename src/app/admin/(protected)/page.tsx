import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase-server";
import type { Place } from "@/lib/places";
import { deletePlace } from "../actions";

async function List({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;
  const { data } = await createAdminClient()
    .from("places")
    .select("*")
    .order("city")
    .order("name");
  const places = (data ?? []) as (Place & { is_published: boolean })[];

  return (
    <>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {places.length === 0 && <p>No places yet.</p>}
      {places.map((p) => (
        <div key={p.id} className="border rounded-lg p-3 mb-2 flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">
              {p.type} · {p.city}
              {!p.is_published && " · hidden"}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link className="underline" href={`/admin/${p.id}/edit`}>
              Edit
            </Link>
            <form action={deletePlace}>
              <input type="hidden" name="id" value={p.id} />
              <button className="underline text-red-600">Delete</button>
            </form>
          </div>
        </div>
      ))}
    </>
  );
}

export default function AdminHome({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Places</h1>
        <Link href="/admin/new" className="bg-black text-white rounded px-3 py-1.5 text-sm">
          Add place
        </Link>
      </div>
      <Suspense>
        <List searchParams={searchParams} />
      </Suspense>
    </>
  );
}
