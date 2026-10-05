import React, { useState, useEffect, useMemo } from 'react';
import defaultGames from './data/games.json';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DisguiseView } from './components/DisguiseView';
import { Gamepad2 } from 'lucide-react';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import panicLogo from '../public/favicon.png';

export default function App() {
  const [games, setGames] = useState(() => {
    try {
      const storedCustom = localStorage.getItem('unblocked_custom_games');
      if (storedCustom) {
        const parsed = JSON.parse(storedCustom);
        return [...parsed, ...defaultGames];
      }
    } catch (e) {
      console.error(e);
    }
    return defaultGames;
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('unblocked_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isDisguiseActive, setIsDisguiseActive] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Observe Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem('unblocked_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Tab Title & Favicon Disguise effect
  useEffect(() => {
    const originalTitle = document.title;
    if (isDisguiseActive) {
      document.title = 'Google Sala de Aula - Tarefas da Turma';
    } else {
      document.title = selectedGame
        ? `${selectedGame.title} - PANIC GAMES`
        : 'PANIC GAMES - Escolha seu jogo';
    }
    return () => {
      document.title = originalTitle;
    };
  }, [isDisguiseActive, selectedGame]);

  // Emergency Panic shortcut: press Escape to toggle disguise
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDisguiseActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Search match
      const matchSearch =
        !searchQuery.trim() ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      // Tab match
      if (activeTab === 'all') return true;
      if (activeTab === 'popular') return !!game.popular;
      if (activeTab === 'featured') return !!game.featured;
      if (activeTab === 'favorites') return favorites.includes(game.id);
      return game.category.toLowerCase() === activeTab.toLowerCase();
    });
  }, [games, searchQuery, activeTab, favorites]);

  const handleQuickPlay = () => {
    if (games.length > 0) {
      const random = games[Math.floor(Math.random() * games.length)];
      setSelectedGame(random);
    }
  };

  const categories = [
    { id: 'all', label: 'Todos os Jogos' },
    { id: 'popular', label: 'Mais Populares' },
    { id: 'favorites', label: `Favoritos (${favorites.length})` },
    { id: 'Ação', label: 'Ação' },
    { id: 'Clássicos', label: 'Clássicos' },
    { id: 'Arcade', label: 'Arcade' },
    { id: 'Puzzle', label: 'Puzzle' },
  ];

  if (isDisguiseActive) {
    return <DisguiseView onExit={() => setIsDisguiseActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-red-600 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        disguiseActive={isDisguiseActive}
        onToggleDisguise={() => setIsDisguiseActive(!isDisguiseActive)}
        onSelectGame={(id) => {
          if (!id) setSelectedGame(null);
        }}
      />

      <main className="flex-1">
        {selectedGame ? (
          <GamePlayer
            game={selectedGame}
            allGames={games}
            onBack={() => setSelectedGame(null)}
            onSelectGame={(game) => setSelectedGame(game)}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={toggleFavorite}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        ) : (
          <>
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onQuickPlay={handleQuickPlay}
              totalGames={games.length}
            />

            {/* Filter and Category Section */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <span>Catálogo</span>
                    <span className="text-red-500 panic-glow-text font-black">PANIC</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    {filteredGames.length} {filteredGames.length === 1 ? 'jogo disponível' : 'jogos disponíveis'}
                    {searchQuery ? ` para a busca "${searchQuery}"` : ''}
                  </p>
                </div>

                {/* Segmented Category Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        activeTab === cat.id
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 panic-glow-sm'
                          : 'bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Games Grid */}
              {filteredGames.length > 0 ? (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={toggleFavorite}
                      onSelect={(g) => setSelectedGame(g)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-16 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-zinc-900 bg-zinc-950/60 max-w-md mx-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-red-500 mb-3 border border-red-950">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-black text-white uppercase tracking-wider">
                    Nenhum jogo encontrado
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 mb-4 leading-relaxed">
                    Não encontramos nenhum jogo correspondente a sua busca ou filtro.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTab('all');
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 text-xs font-black uppercase tracking-wider text-white hover:bg-red-500 transition-colors shadow-md shadow-red-600/30 cursor-pointer"
                  >
                    Redefinir Filtros
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-red-950/40 bg-black py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-md overflow-hidden border border-red-600/40 bg-black shrink-0">
                <img src={panicLogo} alt="PANIC" className="h-full w-full object-cover" />
              </div>
              <span className="font-heading font-black text-white uppercase tracking-wider">
                PANIC <span className="text-red-500 panic-glow-text font-black">GAMES</span>
              </span>
              <span className="text-zinc-800">·</span>
              <span>100% Iframe & HTML5 Nativo</span>
              <span className="text-zinc-800">·</span>
              <span className="text-red-500/80">Escolha seu jogo. Entre em pânico. Divirta-se.</span>
            </div>

            <div className="flex items-center gap-4">
              <span>Pressione <kbd className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">Esc</kbd> para Modo Disfarce</span>
            </div>
          </div>
        </div>
      </footer>

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* User Profile and Cloud Progress Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
      />
    </div>
  );
}
