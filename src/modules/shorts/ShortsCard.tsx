import React from 'react';

export default function ShortsCard() {
  return (
    <div data-testid="shorts-card-container" className="relative w-full max-w-xs mx-auto aspect-[9/16] bg-card rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
      {/* Видео-превью или видео */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-muted-foreground">Видео-превью</span>
      </div>
      {/* Элементы управления сбоку */}
      <div className="absolute right-2 top-1/4 flex flex-col gap-4 items-center z-10">
        <button className="bg-zinc-800 bg-opacity-80 rounded-full p-3 hover:bg-zinc-700 transition">
          <span role="img" aria-label="like">👍</span>
        </button>
        <button className="bg-zinc-800 bg-opacity-80 rounded-full p-3 hover:bg-zinc-700 transition">
          <span role="img" aria-label="comment">💬</span>
        </button>
        <button className="bg-zinc-800 bg-opacity-80 rounded-full p-3 hover:bg-zinc-700 transition">
          <span role="img" aria-label="share">↗️</span>
        </button>
      </div>
      {/* Информация о видео снизу */}
      <div data-testid="video-info-container" className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h2 className="text-lg font-semibold">Название короткого видео</h2>
        <p className="text-zinc-400 text-sm">Описание или автор</p>
      </div>
    </div>
  );
}
