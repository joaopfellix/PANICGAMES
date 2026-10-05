import React from 'react';
import { ShieldCheck, Heart, User } from 'lucide-react';
import logoImg from '../../public/favicon.png';

export const Navbar = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  disguiseActive,
  onToggleDisguise,
  onSelectGame,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-red-950/40 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark with Panic Emblem Logo */}
        <button
          onClick={() => {
            onSelectGame(null);
            setActiveTab('all');
          }}
          className="flex items-center gap-3 text-left group transition-transform focus:outline-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden border border-red-600/40 bg-black panic-glow-sm group-hover:border-red-500 group-hover:panic-glow-md transition-all">
            <img
              src={logoImg}
              alt="PANIC Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-heading text-2xl font-black tracking-wider text-white uppercase flex items-center gap-1.5">
            <span>PANIC</span>
            <span className="text-red-500 panic-glow-text font-black">GAMES</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide uppercase text-zinc-400">
          <button
            onClick={() => {
              onSelectGame(null);
              setActiveTab('all');
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'all' ? 'text-red-500 font-bold panic-glow-text' : ''
            }`}
          >
            Todos os Jogos
          </button>
          <button
            onClick={() => {
              onSelectGame(null);
              setActiveTab('popular');
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'popular' ? 'text-red-500 font-bold panic-glow-text' : ''
            }`}
          >
            Populares
          </button>
          <button
            onClick={() => {
              onSelectGame(null);
              setActiveTab('featured');
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'featured' ? 'text-red-500 font-bold panic-glow-text' : ''
            }`}
          >
            Destaques
          </button>
          <button
            onClick={() => {
              onSelectGame(null);
              setActiveTab('favorites');
            }}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${
              activeTab === 'favorites' ? 'text-red-500 font-bold panic-glow-text' : ''
            }`}
          >
            <Heart className={`h-4 w-4 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            <span>Favoritos</span>
            {favoritesCount > 0 && (
              <span className="text-xs text-red-500 font-mono">({favoritesCount})</span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3">
          {/* Panic / Cloak Mode Toggle Button */}
          <button
            onClick={onToggleDisguise}
            title="Disfarçar aba como Google Sala de Aula"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
              disguiseActive
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Modo Disfarce</span>
          </button>

          {/* User Account Button: Entrar/Cadastrar OR Profile */}
          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              title="Meu Perfil e Progresso Salvo"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-zinc-950 border border-red-950/80 rounded-xl hover:border-red-500/60 hover:bg-zinc-900 transition-all shadow-sm"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Jogador'}
                  referrerPolicy="no-referrer"
                  className="h-5 w-5 rounded-full object-cover border border-red-500"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[10px]">
                  {(currentUser.displayName || currentUser.email || 'P')[0].toUpperCase()}
                </div>
              )}
              <span className="max-w-[100px] truncate">
                {currentUser.displayName || currentUser.email.split('@')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 rounded-xl hover:bg-red-500 transition-colors shadow-md shadow-red-600/30 whitespace-nowrap"
            >
              <User className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Entrar / Cadastrar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
