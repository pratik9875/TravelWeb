import type { MetadataRoute } from "next";
import { getCities, getAllPlaceIds, slugify, SITE_URL } from "@/lib/places";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, ids] = await Promise.all([getCities(), getAllPlaceIds()]);
  const cityPages = cities.flatMap(({ city, types }) =>
    types.map((t) => ({ url: `${SITE_URL}/${t}s/${slugify(city)}` }))
  );
  const placePages = ids.map((id) => ({ url: `${SITE_URL}/place/${id}` }));
  return [{ url: SITE_URL }, ...cityPages, ...placePages];
}
