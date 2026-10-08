import Link from "next/link";
import type { Place } from "@/lib/places";

export default function PlaceCard({ p }: { p: Place }) {
  return (
    <div className="border rounded-lg p-4 mb-3">
      {p.photos[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.photos[0]} alt={p.name} className="h-40 w-full object-cover rounded mb-2" />
      )}
      <h2 className="font-semibold">
        <Link href={`/place/${p.id}`} className="hover:underline">
          {p.name}
        </Link>
      </h2>
      {p.why_we_picked && <p className="text-sm text-gray-600">{p.why_we_picked}</p>}
      {p.price_min != null && (
        <p className="text-sm">
          Rs {p.price_min} - {p.price_max}
        </p>
      )}
      {p.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {p.tags.map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-3 mt-2">
        <a
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
        >
          Get Directions
        </a>
        {p.phone && (
          <a className="underline" href={`tel:${p.phone}`}>
            Call
          </a>
        )}
      </div>
    </div>
  );
}
