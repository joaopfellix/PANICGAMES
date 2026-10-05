import React from 'react';
import { Gamepad2, Plus, ShieldCheck, Heart } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  onOpenAddModal,
  disguiseActive,
  onToggleDisguise,
  onSelectGame,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark with icon */}
        <button
          onClick={() => {
            onSelectGame(null);
            setActiveTab('all');
          }}
          className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 group-hover:bg-rose-500/20 group-hover:border-rose-500/50 transition-colors">
            <Gamepad2 className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-black tracking-wider text-slate-100 uppercase">
            PANIC <span className="text-rose-500">GAMES</span>
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              onSelectGame(null);
              setActiveTab('all');
            }}
            className={`transition-colors hover:text-slate-100 ${
              activeTab === 'all' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Todos os Jogos
          </button>
          <button
            onClick={() => {
              onSelectGame(null);
              setActiveTab('popular');
            }}
            className={`transition-colors hover:text-slate-100 ${
              activeTab === 'popular' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Populares
          </button>
          <button
            onClick={() => {
              onSelectGame(null);
              setActiveTab('featured');
            }}
            className={`transition-colors hover:text-slate-100 ${
              activeTab === 'featured' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Destaques
          </button>
          <button
            onClick={() => {
              onSelectGame(null);
              setActiveTab('favorites');
            }}
            className={`flex items-center gap-1.5 transition-colors hover:text-slate-100 ${
              activeTab === 'favorites' ? 'text-rose-400 font-semibold' : ''
            }`}
          >
            <Heart className={`h-4 w-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Favoritos</span>
            {favoritesCount > 0 && (
              <span className="text-xs text-rose-400 font-mono">({favoritesCount})</span>
            )}
          </button>
        </nav>

        {/* Zone 3: 2 Primary actions */}
        <div className="flex items-center gap-3">
          {/* Panic / Cloak Mode Toggle Button */}
          <button
            onClick={onToggleDisguise}
            title="Disfarçar aba como Google Sala de Aula"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              disguiseActive
                ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm shadow-blue-500/20'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:text-slate-100'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Modo Disfarce</span>
          </button>

          {/* Add Game Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors shadow-sm shadow-emerald-500/20 whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Adicionar Jogo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
