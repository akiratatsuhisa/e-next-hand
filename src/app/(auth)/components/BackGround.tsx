export function BackGround({
  bgClass,
  children,
}: {
  bgClass: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative min-h-[calc(100dvh_-_65px)] bg-center bg-no-repeat bg-cover ${bgClass} p-6 flex flex-col justify-center items-center`}
    >
      {children}
    </div>
  );
}
