import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PlaceCard from "@/components/PlaceCard";
import { getPlaces, unslugify } from "@/lib/places";

type Props = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = unslugify((await params).city);
  return {
    title: `Best Hotels in ${city} | TravelStay`,
    description: `Hand-picked, clean and family-safe hotels in ${city}, with directions and phone numbers.`,
  };
}

async function Results({ params }: Props) {
  const city = unslugify((await params).city);
  const places = await getPlaces("hotel", city);

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Hotels in {city}</h1>
      {places.length === 0 && <p>No hotels listed for {city} yet.</p>}
      {places.map((p) => (
        <PlaceCard key={p.id} p={p} />
      ))}
    </>
  );
}

export default function Page({ params }: Props) {
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <Link href="/" className="text-sm underline">
        Home
      </Link>
      <Suspense fallback={<p className="my-4">Loading...</p>}>
        <Results params={params} />
      </Suspense>
    </main>
  );
}
