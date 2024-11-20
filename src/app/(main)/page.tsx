import { getServerSession } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <div className="px-6 max-w-5xl mx-auto">
      <p>Home Page</p>
      <pre>{JSON.stringify(session ?? "", undefined, 2)}</pre>
    </div>
  );
}
