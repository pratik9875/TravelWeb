import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlace, slugify } from "@/lib/places";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const place = await getPlace((await params).id);
  if (!place) return { title: "Place not found | TravelStay" };
  return {
    title: `${place.name}, ${place.city} | TravelStay`,
    description: place.why_we_picked ?? `${place.name} in ${place.city}`,
    openGraph: place.photos[0] ? { images: [place.photos[0]] } : undefined,
  };
}

async function Details({ params }: Props) {
  const p = await getPlace((await params).id);
  if (!p) notFound();

  return (
    <article>
      <Link href={`/${p.type}s/${slugify(p.city)}`} className="text-sm underline">
        All {p.type}s in {p.city}
      </Link>
      <h1 className="text-3xl font-bold mt-3">{p.name}</h1>
      <p className="text-gray-600 mb-4 capitalize">
        {p.type} · {p.city}
      </p>

      {p.photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-4">
          {p.photos.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={url} src={url} alt={p.name} className="h-56 rounded-lg object-cover" />
          ))}
        </div>
      )}

      {p.why_we_picked && <p className="mb-3">{p.why_we_picked}</p>}
      {p.price_min != null && (
        <p className="mb-1">
          <strong>Price:</strong> Rs {p.price_min}
          {p.price_max != null && ` - ${p.price_max}`}
        </p>
      )}
      {p.address && (
        <p className="mb-1">
          <strong>Address:</strong> {p.address}
        </p>
      )}
      {p.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 my-3">
          {p.tags.map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <a
          className="bg-black text-white rounded px-4 py-2"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
        >
          Get Directions
        </a>
        {p.phone && (
          <a className="border rounded px-4 py-2" href={`tel:${p.phone}`}>
            Call
          </a>
        )}
      </div>
    </article>
  );
}

export default function PlacePage({ params }: Props) {
  return (
    <main className="p-4 max-w-2xl mx-auto">
      <Suspense fallback={<p>Loading...</p>}>
        <Details params={params} />
      </Suspense>
    </main>
  );
}
