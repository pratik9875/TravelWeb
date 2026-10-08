import { Suspense } from "react";
import Link from "next/link";
import { getCities, slugify } from "@/lib/places";

async function Cities() {
  const cities = await getCities();

  return (
    <>
      {cities.length === 0 && <p>No cities yet.</p>}
      {cities.map(({ city, types }) => (
        <div key={city} className="border rounded-lg p-4 mb-3">
          <h2 className="font-semibold mb-2">{city}</h2>
          <div className="flex gap-4">
            {types.includes("hotel") && (
              <Link className="underline" href={`/hotels/${slugify(city)}`}>
                Hotels
              </Link>
            )}
            {types.includes("restaurant") && (
              <Link className="underline" href={`/restaurants/${slugify(city)}`}>
                Restaurants
              </Link>
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mt-6">TravelStay</h1>
      <p className="text-gray-600 mb-6">
        Clean, safe and family-friendly hotels and restaurants along your route.
      </p>
      <Suspense fallback={<p>Loading cities...</p>}>
        <Cities />
      </Suspense>
    </main>
  );
}
