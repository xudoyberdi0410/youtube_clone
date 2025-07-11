import ShortsCard from './ShortsCard';

export default function ShortsList() {
  // Здесь будет список коротких видео (shorts)
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-8">Shorts</h1>
      <div className="w-full flex flex-col items-center gap-8">
        <ShortsCard />
        {/* Можно добавить больше <ShortsCard /> для других видео */}
      </div>
    </main>
  );
}
