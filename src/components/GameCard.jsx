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
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-emerald-950/20 cursor-pointer"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
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
              background: `radial-gradient(circle at 50% 50%, ${game.accentColor}25 0%, #030712 90%)`,
            }}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-900/80 mb-2 shadow-inner"
              style={{ color: game.accentColor }}
            >
              <Play className="h-6 w-6 fill-current" />
            </div>
            <span className="font-heading text-lg font-bold tracking-wide text-slate-200">
              {game.title}
            </span>
          </div>
        )}

        {/* Play hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span>JOGAR AGORA</span>
          </div>
        </div>

        {/* Top bar over thumbnail: Favorite toggle */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            type="button"
            onClick={(e) => onToggleFavorite(game.id, e)}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950/70 text-slate-300 backdrop-blur-md transition-colors hover:bg-slate-900 hover:text-rose-400"
          >
            <Heart
              className={`h-4 w-4 transition-transform active:scale-125 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col p-4">
        {/* Zero-Pill Metadata Discipline */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 font-medium">
          <span className="text-emerald-400">{game.category}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-0.5 text-amber-300">
            <Star className="h-3 w-3 fill-amber-300" />
            <span className="font-mono tabular-nums">{game.rating.toFixed(1)}</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono tabular-nums text-slate-400">{game.plays} plays</span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
          {game.title}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-xs text-slate-400 leading-relaxed">
          {game.description}
        </p>

        {/* Card Footer with iframe indicator */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>Iframe Ativo</span>
          </span>
          <span className="font-semibold text-emerald-400/90 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Abrir Jogo &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
