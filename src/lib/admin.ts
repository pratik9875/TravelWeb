import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase-server";

const allowed = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

// Returns the logged-in user only if their email is in ADMIN_EMAILS.
export async function getAdmin() {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  return email && allowed().includes(email) ? data.user : null;
}

// Call at the top of every admin component/action that touches data. Layouts and
// pages render in parallel, so a check in the layout alone does not protect the page.
export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
