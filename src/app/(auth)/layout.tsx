import { DefaultTopBar } from "@/components/TopBar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh">
      <DefaultTopBar />

      {children}
    </div>
  );
}
