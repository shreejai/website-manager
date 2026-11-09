import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Website Manager</h1>
      <ul className="mt-4 list-disc pl-6">
        <li>
          <Link href="/manager">Manager</Link>
        </li>
      </ul>
    </main>
  );
}
