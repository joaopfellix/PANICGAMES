import React from 'react';
import { Search, Play, Zap, Flame, ShieldAlert } from 'lucide-react';
import heroBg from '../assets/images/panic_hero_banner_1791236289088.jpg';
import panicLogo from '../../public/favicon.png';

export const HeroBanner = ({
  searchQuery,
  setSearchQuery,
  onQuickPlay,
  totalGames,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-red-950/40 bg-black">
      {/* Background with blood red gradient scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="PANIC GAMES Atmosphere"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-40 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            {/* Metadata without pills */}
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 mb-3 tracking-wider uppercase">
              <span className="flex items-center gap-1.5 text-red-500 panic-glow-text">
                <Flame className="h-4 w-4 fill-red-500" /> PANIC GAMES
              </span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="text-zinc-300">
                {totalGames} {totalGames === 1 ? 'Jogo em Iframe' : 'Jogos em Iframe'}
              </span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="text-zinc-400">100% Desbloqueado</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="text-red-400/90">Modo Camuflagem (Esc)</span>
            </div>

            <h1
              className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-none"
              style={{ textWrap: 'balance' }}
            >
              Escolha seu jogo.{' '}
              <span className="text-red-500 panic-glow-text block sm:inline">
                Entre em pânico.
              </span>{' '}
              Divirta-se.
            </h1>

            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
              Uma seleção de jogos para jogar direto no navegador. Sem anúncios intrusivos,
              carregamento ultrarrápido em HTML5 e Iframe com salvamento de recordes na nuvem.
            </p>

            {/* Search bar & Quick Play action */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar jogo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950/90 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <button
                onClick={onQuickPlay}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-black uppercase tracking-wider text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/30 hover:panic-glow-md shrink-0 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Jogar Agora</span>
              </button>
            </div>
          </div>

          {/* Right Mascot Spotlight */}
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-red-600 to-rose-700 opacity-30 blur-xl group-hover:opacity-60 transition duration-700" />
              <div className="relative h-64 w-64 rounded-2xl overflow-hidden border border-red-600/40 bg-zinc-950 p-2 shadow-2xl panic-glow-md">
                <img
                  src={panicLogo}
                  alt="PANIC Mask Emblem"
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
