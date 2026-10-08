import { Suspense } from "react";
import PlaceForm from "@/components/PlaceForm";
import { requireAdmin } from "@/lib/admin";

async function Form({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;
  return <PlaceForm error={error} />;
}

export default function NewPlace({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Add place</h1>
      <Suspense>
        <Form searchParams={searchParams} />
      </Suspense>
    </>
  );
}
