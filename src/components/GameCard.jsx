import React from 'react';
import { Play, Heart, Star } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/80 transition-all duration-200 hover:-translate-y-1 hover:border-red-600/70 hover:shadow-xl hover:shadow-red-950/30 hover:panic-glow-sm cursor-pointer"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Robust CSS Fallback container per zero-broken-image policy */
          <div
            className="flex h-full w-full flex-col items-center justify-center p-6 text-center"
            style={{
              background: `radial-gradient(circle at 50% 50%, #dc262625 0%, #030305 90%)`,
            }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-red-950 bg-black mb-2 shadow-inner text-red-500"
            >
              <Play className="h-6 w-6 fill-current" />
            </div>
            <span className="font-heading text-lg font-bold tracking-wide text-zinc-200">
              {game.title}
            </span>
          </div>
        )}

        {/* Play hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/40 panic-glow-sm">
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>JOGAR AGORA</span>
          </div>
        </div>

        {/* Top bar over thumbnail: Favorite toggle */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            type="button"
            onClick={(e) => onToggleFavorite(game.id, e)}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-zinc-300 backdrop-blur-md transition-colors hover:bg-zinc-900 hover:text-red-500"
          >
            <Heart
              className={`h-4 w-4 transition-transform active:scale-125 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-4 bg-zinc-950/40">
        {/* Zero-Pill Metadata Discipline */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5 font-medium">
          <span className="text-red-400 font-bold uppercase tracking-wider text-[11px]">{game.category}</span>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <span className="flex items-center gap-0.5 text-amber-400">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-mono text-zinc-200">{game.rating ? game.rating.toFixed(1) : '5.0'}</span>
          </span>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <span className="font-mono text-zinc-400">{game.plays || '0'} plays</span>
        </div>

        <h3 className="font-heading text-lg font-black text-white group-hover:text-red-400 transition-colors uppercase tracking-wide">
          {game.title}
        </h3>

        <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {game.description}
        </p>

        {/* Bottom card footer */}
        <div className="mt-4 flex items-center justify-between border-t border-zinc-900 pt-3 text-[11px] text-zinc-400">
          <span className="font-mono text-zinc-400 truncate max-w-[170px]">
            {game.controls && game.controls[0] ? game.controls[0].split(':')[0] : 'Teclado'}
          </span>

          <span className="font-bold text-red-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            <span>Jogar</span>
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </div>
    </div>
  );
};
