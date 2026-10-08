import { savePlace } from "@/app/admin/actions";
import type { Place } from "@/lib/places";

const input = "border rounded p-2 w-full";

export default function PlaceForm({
  place,
  error,
}: {
  place?: (Place & { is_published: boolean }) | null;
  error?: string;
}) {
  return (
    <form action={savePlace} className="flex flex-col gap-3">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {place && <input type="hidden" name="id" value={place.id} />}

      <input name="name" required placeholder="Name" defaultValue={place?.name} className={input} />
      <select name="type" required defaultValue={place?.type ?? "hotel"} className={input}>
        <option value="hotel">Hotel</option>
        <option value="restaurant">Restaurant</option>
      </select>
      <input name="city" required placeholder="City" defaultValue={place?.city} className={input} />
      <input name="address" placeholder="Address" defaultValue={place?.address ?? ""} className={input} />
      <div className="flex gap-3">
        <input name="lat" required placeholder="Latitude" defaultValue={place?.lat} className={input} />
        <input name="lng" required placeholder="Longitude" defaultValue={place?.lng} className={input} />
      </div>
      <div className="flex gap-3">
        <input name="price_min" placeholder="Min price (Rs)" defaultValue={place?.price_min ?? ""} className={input} />
        <input name="price_max" placeholder="Max price (Rs)" defaultValue={place?.price_max ?? ""} className={input} />
      </div>
      <input
        name="tags"
        placeholder="Tags, comma separated (parking, veg, family-safe)"
        defaultValue={place?.tags.join(", ")}
        className={input}
      />
      <textarea name="why_we_picked" rows={3} placeholder="Why we picked it" defaultValue={place?.why_we_picked ?? ""} className={input} />
      <input name="phone" placeholder="Phone (+91...)" defaultValue={place?.phone ?? ""} className={input} />

      {place && place.photos.length > 0 && (
        <fieldset className="border rounded p-2">
          <legend className="text-sm px-1">Current photos (untick to remove)</legend>
          <div className="flex flex-wrap gap-3">
            {place.photos.map((url) => (
              <label key={url} className="text-center text-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-20 w-28 object-cover rounded mb-1" />
                <input type="checkbox" name="keep_photo" value={url} defaultChecked />
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <label className="text-sm">
        Add photos
        <input type="file" name="new_photos" accept="image/*" multiple className="block mt-1" />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="is_published" defaultChecked={place?.is_published ?? true} />
        Published (visible on the site)
      </label>

      <button className="bg-black text-white rounded p-2">{place ? "Save changes" : "Add place"}</button>
    </form>
  );
}
