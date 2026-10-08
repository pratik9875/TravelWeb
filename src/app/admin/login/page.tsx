import { Suspense } from "react";
import { login } from "../actions";

async function Form({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <form action={login} className="flex flex-col gap-3">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input name="email" type="email" required placeholder="Email" autoComplete="email" className="border rounded p-2" />
      <input name="password" type="password" required placeholder="Password" autoComplete="current-password" className="border rounded p-2" />
      <button className="bg-black text-white rounded p-2">Log in</button>
    </form>
  );
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <main className="p-4 max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-4">Admin login</h1>
      <Suspense>
        <Form searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
