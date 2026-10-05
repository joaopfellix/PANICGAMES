import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  Heart,
  Share2,
  Check,
  Tv,
  Gamepad,
  Layers,
} from 'lucide-react';

export const GamePlayer = ({
  game,
  allGames,
  onBack,
  onSelectGame,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef(null);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Other recommendations
  const recommendations = allGames.filter((g) => g.id !== game.id).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Top action row */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Catálogo</span>
        </button>

        {/* Player controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            title="Reiniciar jogo no iframe"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            title="Modo Teatro (Expandir tela)"
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isTheater
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Tv className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Teatro</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="Tela Cheia"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Sair' : 'Tela Cheia'}</span>
          </button>

          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            title="Favoritar este jogo"
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              isFavorite
                ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-rose-400'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'Favorito' : 'Favoritar'}</span>
          </button>

          <button
            onClick={handleShare}
            title="Copiar link"
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Compartilhar'}</span>
          </button>
        </div>
      </div>

      {/* Main Iframe Gaming Box */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300 ${
          isTheater ? 'w-full' : 'mx-auto max-w-5xl'
        }`}
      >
        <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full min-h-[460px] max-h-[80vh] bg-black">
          <iframe
            key={iframeKey}
            src={game.iframeSrc}
            title={game.title}
            className="h-full w-full border-0 select-none"
            allow="fullscreen; autoplay; gamepad"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
          />
        </div>
      </div>

      {/* Bottom Information & Controls Section */}
      <div
        className={`mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 ${
          isTheater ? 'w-full' : 'mx-auto max-w-5xl'
        }`}
      >
        {/* Left 2 Cols: Details & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
                  <span className="text-emerald-400">{game.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono tabular-nums">{game.plays} jogadas</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono tabular-nums text-amber-300">★ {game.rating.toFixed(1)}</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-slate-100">
                  {game.title}
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {game.description}
            </p>

            {/* Controls Guide */}
            <div>
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                <Gamepad className="h-4 w-4 text-emerald-400" />
                <span>Instruções e Controles</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {game.controls.map((control, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{control}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Next Games */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>Jogar Outro Jogo</span>
            </h3>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => onSelectGame(rec)}
                  className="w-full flex items-center gap-3 rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 text-left transition-all hover:border-slate-700 hover:bg-slate-900 group"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-800 bg-slate-900 font-heading font-bold text-sm"
                    style={{ color: rec.accentColor }}
                  >
                    {rec.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-heading text-sm font-bold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                      {rec.title}
                    </h5>
                    <p className="text-xs text-slate-500 truncate">{rec.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
