import { Suspense } from "react";
import { notFound } from "next/navigation";
import PlaceForm from "@/components/PlaceForm";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase-server";
import type { Place } from "@/lib/places";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

async function Form({ params, searchParams }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const { data } = await createAdminClient().from("places").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <PlaceForm place={data as Place & { is_published: boolean }} error={error} />;
}

export default function EditPlace(props: Props) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Edit place</h1>
      <Suspense>
        <Form {...props} />
      </Suspense>
    </>
  );
}
