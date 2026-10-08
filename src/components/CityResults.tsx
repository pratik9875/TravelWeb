import PlaceCard from "@/components/PlaceCard";
import { getPlaces, unslugify, type Place } from "@/lib/places";

export type CityProps = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ tag?: string; max?: string }>;
};

const label = { hotel: "Hotels", restaurant: "Restaurants" } as const;

export default async function CityResults({
  type,
  params,
  searchParams,
}: CityProps & { type: Place["type"] }) {
  const city = unslugify((await params).city);
  const { tag = "", max = "" } = await searchParams;
  const all = await getPlaces(type, city);

  const maxPrice = Number(max);
  const places = all.filter(
    (p) =>
      (!tag || p.tags.includes(tag)) &&
      (!max || !Number.isFinite(maxPrice) || p.price_min == null || p.price_min <= maxPrice)
  );
  const tags = [...new Set(all.flatMap((p) => p.tags))].sort();
  const filtered = Boolean(tag || max);

  return (
    <>
      <h1 className="text-2xl font-bold my-4">
        {label[type]} in {city}
      </h1>

      {all.length > 0 && (
        <form className="flex flex-wrap items-end gap-3 mb-4 text-sm">
          <label>
            Tag
            <select name="tag" defaultValue={tag} className="block border rounded p-2">
              <option value="">Any</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            Max price (Rs)
            <input
              name="max"
              type="number"
              min={0}
              defaultValue={max}
              placeholder="e.g. 1500"
              className="block border rounded p-2 w-32"
            />
          </label>
          <button className="bg-black text-white rounded px-4 py-2">Filter</button>
          {filtered && (
            <a href="?" className="underline py-2">
              Clear
            </a>
          )}
        </form>
      )}

      {all.length === 0 && <p>No {label[type].toLowerCase()} listed for {city} yet.</p>}
      {all.length > 0 && places.length === 0 && <p>Nothing matches these filters.</p>}
      {places.map((p) => (
        <PlaceCard key={p.id} p={p} />
      ))}
    </>
  );
}
