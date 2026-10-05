import React, { useState, useEffect, useMemo } from 'react';
import defaultGames from './data/games.json';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { GameCard } from './components/GameCard';
import { GamePlayer } from './components/GamePlayer';
import { AddGameModal } from './components/AddGameModal';
import { DisguiseView } from './components/DisguiseView';
import { Gamepad2 } from 'lucide-react';

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
      return stored ? JSON.parse(stored) : ['snake-retro', 'game-2048'];
    } catch {
      return ['snake-retro', 'game-2048'];
    }
  });

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDisguiseActive, setIsDisguiseActive] = useState(false);

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
        : 'PANIC GAMES';
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

  const handleAddCustomGame = (newGame) => {
    setGames((prev) => [newGame, ...prev]);
    try {
      const storedCustom = localStorage.getItem('unblocked_custom_games');
      const list = storedCustom ? JSON.parse(storedCustom) : [];
      localStorage.setItem('unblocked_custom_games', JSON.stringify([newGame, ...list]));
    } catch (e) {
      console.error(e);
    }
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
    { id: 'Clássicos', label: 'Clássicos' },
    { id: 'Arcade', label: 'Arcade' },
    { id: 'Puzzle', label: 'Puzzle' },
    { id: 'Ação', label: 'Ação' },
  ];

  if (isDisguiseActive) {
    return <DisguiseView onExit={() => setIsDisguiseActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
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
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div>
                  <h2 className="font-heading text-2xl font-bold uppercase tracking-wider text-slate-100">
                    Catálogo de Jogos
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {filteredGames.length} {filteredGames.length === 1 ? 'jogo disponível' : 'jogos disponíveis'}
                    {searchQuery ? ` para a busca "${searchQuery}"` : ''}
                  </p>
                </div>

                {/* Segmented Category Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        activeTab === cat.id
                          ? 'bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 hover:border-slate-700'
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
                <div className="mt-16 flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 max-w-md mx-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-slate-400 mb-3">
                    <Gamepad2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-200">
                    Nenhum jogo encontrado
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                    Não encontramos nenhum jogo correspondente a sua busca ou filtro.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTab('all');
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
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
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-slate-200 uppercase tracking-wide">
                PANIC <span className="text-rose-500">GAMES</span>
              </span>
              <span>·</span>
              <span>100% Iframe & HTML5 Nativo</span>
              <span>·</span>
              <span className="text-emerald-400/80">Sem Recursos de IA</span>
            </div>

            <div className="flex items-center gap-4">
              <span>Pressione <kbd className="rounded border border-slate-800 bg-slate-900 px-1 py-0.5 font-mono text-[10px] text-slate-300">Esc</kbd> para ativar o Modo Disfarce</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Add Custom Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddCustomGame}
      />
    </div>
  );
}
