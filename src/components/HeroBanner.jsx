import React from 'react';
import { Search, Play, Zap, Plus } from 'lucide-react';
import heroImg from '../assets/images/hero_arcade_games_1791231387363.jpg';

export const HeroBanner = ({
  searchQuery,
  setSearchQuery,
  onQuickPlay,
  totalGames,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/60 bg-slate-950">
      {/* Background with measured gradient scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Arcade Gaming Portal"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-30 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          {/* Metadata without pills - clean typographic separators */}
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-3 tracking-wide">
            <span className="font-heading uppercase tracking-wider text-rose-400 font-bold">PANIC GAMES</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Zap className="h-3 w-3" /> {totalGames} {totalGames === 1 ? 'Jogo em Iframe' : 'Jogos em Iframe'}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">100% Desbloqueados</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Camuflagem com Esc</span>
          </div>

          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-100 sm:text-5xl uppercase leading-none" style={{ textWrap: 'balance' }}>
            Jogue Seus Clássicos Favoritos Diretamente No Navegador
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Acesso livre e instantâneo a jogos lendários em HTML5 e Iframe local.
            Carregamento ultrarrápido, compatível com computadores da escola e celular.
          </p>

          {/* Search bar & Quick Play action */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar jogo (ex: Snake, 2048, Pong, Tetris)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Limpar
                </button>
              )}
            </div>

            <button
              onClick={onQuickPlay}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20 shrink-0"
            >
              {totalGames > 0 ? (
                <>
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>Jogar Aleatório</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>Adicionar Jogo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

