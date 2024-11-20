import TopBar from "@/components/TopBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh">
      <TopBar />
      <div className="min-h-[calc(100dvh_-_65px)] p-6 flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );
}
