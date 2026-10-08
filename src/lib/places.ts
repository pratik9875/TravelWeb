import { supabase } from "@/lib/supabase";

export type Place = {
  id: string;
  name: string;
  type: "hotel" | "restaurant";
  city: string;
  address: string | null;
  lat: number;
  lng: number;
  price_min: number | null;
  price_max: number | null;
  tags: string[];
  why_we_picked: string | null;
  phone: string | null;
  photos: string[];
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const slugify = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");
export const unslugify = (s: string) =>
  decodeURIComponent(s).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export async function getPlaces(type: Place["type"], city: string) {
  const { data } = await supabase
    .from("places")
    .select("*")
    .eq("type", type)
    .ilike("city", city);
  return (data ?? []) as Place[];
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPlace(id: string) {
  if (!UUID.test(id)) return null;
  const { data } = await supabase.from("places").select("*").eq("id", id).maybeSingle();
  return (data as Place | null) ?? null;
}

export async function getAllPlaceIds() {
  const { data } = await supabase.from("places").select("id");
  return (data ?? []).map((r) => r.id as string);
}

export async function getCities() {
  const { data } = await supabase.from("places").select("city, type");
  const seen = new Map<string, Set<Place["type"]>>();
  for (const r of data ?? []) {
    if (!seen.has(r.city)) seen.set(r.city, new Set());
    seen.get(r.city)!.add(r.type);
  }
  return [...seen.entries()].map(([city, types]) => ({ city, types: [...types] }));
}
