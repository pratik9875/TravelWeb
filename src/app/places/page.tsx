import { supabase } from "@/lib/supabase";

export default async function PlacesPage() {
  const { data: places } = await supabase.from("places").select("*");

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Places</h1>
      {places?.map((p) => (
        <div key={p.id} className="border rounded-lg p-4 mb-3">
          <h2 className="font-semibold">{p.name}</h2>
          <p className="text-sm text-gray-600">{p.why_we_picked}</p>
          <p className="text-sm">Rs {p.price_min} - {p.price_max}</p>
          <div className="flex gap-3 mt-2">
            <a
              className="underline"
              target="_blank"
              href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
            >
              Get Directions
            </a>
            {p.phone && <a className="underline" href={`tel:${p.phone}`}>Call</a>}
          </div>
        </div>
      ))}
    </main>
  );
}
