import type { MetadataRoute } from "next";
import { getCities, slugify, SITE_URL } from "@/lib/places";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cities = await getCities();
  const pages = cities.flatMap(({ city, types }) =>
    types.map((t) => ({ url: `${SITE_URL}/${t}s/${slugify(city)}` }))
  );
  return [{ url: SITE_URL }, ...pages];
}
