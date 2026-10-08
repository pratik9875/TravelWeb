import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CityResults, { type CityProps } from "@/components/CityResults";
import { unslugify } from "@/lib/places";

export async function generateMetadata({ params }: Pick<CityProps, "params">): Promise<Metadata> {
  const city = unslugify((await params).city);
  return {
    title: `Best Restaurants in ${city} | TravelStay`,
    description: `Hand-picked, clean and family-safe restaurants in ${city}, with directions and phone numbers.`,
  };
}

export default function Page({ params, searchParams }: CityProps) {
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <Link href="/" className="text-sm underline">
        Home
      </Link>
      <Suspense fallback={<p className="my-4">Loading...</p>}>
        <CityResults type="restaurant" params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
