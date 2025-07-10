// Абсолютно новый layout для Shorts

// layout удалён по запросу
export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full h-full">{children}</div>;
}
