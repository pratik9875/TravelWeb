import { Suspense } from "react";
import PlaceCard from "@/components/PlaceCard";
import { supabase } from "@/lib/supabase";
import type { Place } from "@/lib/places";

async function AllPlaces() {
  const { data } = await supabase.from("places").select("*");
  return (data as Place[] | null)?.map((p) => <PlaceCard key={p.id} p={p} />);
}

export default function PlacesPage() {
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Places</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <AllPlaces />
      </Suspense>
    </main>
  );
}
