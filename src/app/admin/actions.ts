"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdmin, requireAdmin } from "@/lib/admin";
import { createAdminClient, createSessionClient } from "@/lib/supabase-server";

const BUCKET = "place-photos";

export async function login(formData: FormData) {
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) redirect("/admin/login?error=Invalid+email+or+password");

  if (!(await getAdmin())) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=This+account+is+not+an+admin");
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const num = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

export async function savePlace(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const back = id ? `/admin/${id}/edit` : "/admin/new";

  const lat = num(formData.get("lat"));
  const lng = num(formData.get("lng"));
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const price_min = num(formData.get("price_min"));
  const price_max = num(formData.get("price_max"));

  const fail = (m: string): never => redirect(`${back}?error=${encodeURIComponent(m)}`);
  if (!name || !city) fail("Name and city are required");
  if (type !== "hotel" && type !== "restaurant") fail("Choose hotel or restaurant");
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    fail("Latitude and longitude must be numbers");
  }
  if (Number.isNaN(price_min) || Number.isNaN(price_max)) fail("Prices must be numbers");

  const db = createAdminClient();

  // Keep the photos still ticked, then upload any new ones.
  const photos = formData.getAll("keep_photo").map(String);
  for (const f of formData.getAll("new_photos")) {
    if (!(f instanceof File) || f.size === 0) continue;
    if (!f.type.startsWith("image/")) fail("Only image files can be uploaded");
    const ext = (f.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await db.storage.from(BUCKET).upload(path, f, { contentType: f.type });
    if (error) fail(`Photo upload failed: ${error.message}`);
    photos.push(db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
  }

  const row = {
    name,
    type,
    city,
    address: String(formData.get("address") ?? "").trim() || null,
    lat,
    lng,
    price_min,
    price_max,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean),
    why_we_picked: String(formData.get("why_we_picked") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    photos,
    is_published: formData.get("is_published") === "on",
  };

  const { error } = id
    ? await db.from("places").update(row).eq("id", id)
    : await db.from("places").insert(row);
  if (error) fail(error.message);

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deletePlace(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const { error } = await createAdminClient().from("places").delete().eq("id", id);
  if (error) redirect(`/admin?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  redirect("/admin");
}
