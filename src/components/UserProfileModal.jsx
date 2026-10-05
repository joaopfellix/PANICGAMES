import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Clock,
  Gamepad2,
  LogOut,
} from 'lucide-react';
import { logoutUser, getUserAllProgress } from '../services/firebase';

export const UserProfileModal = ({ isOpen, onClose, user, onLogout }) => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user && user.uid) {
      setLoading(true);
      getUserAllProgress(user.uid)
        .then((list) => {
          setProgressList(list || []);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    await logoutUser();
    if (onLogout) onLogout();
    onClose();
  };

  const formatSeconds = (sec) => {
    if (!sec || sec < 60) return `${sec || 0}s`;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-red-950/70 bg-zinc-950 p-6 shadow-2xl panic-glow-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Jogador'}
                referrerPolicy="no-referrer"
                className="h-12 w-12 rounded-full border-2 border-red-600 object-cover panic-glow-sm"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-950/50 border-2 border-red-600 text-red-500 font-heading font-black text-xl panic-glow-sm">
                {(user.displayName || user.email || 'P')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-heading text-xl font-black text-white flex items-center gap-2 uppercase tracking-wide">
                <span>{user.displayName || 'Jogador'}</span>
                <span className="text-[10px] text-red-400 bg-red-600/20 border border-red-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                  Online
                </span>
              </h3>
              <p className="text-xs text-zinc-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span>Progresso & Estatísticas de Jogos</span>
              </h4>
              <span className="text-[11px] font-mono text-zinc-500">
                {progressList.length} {progressList.length === 1 ? 'salvo' : 'salvos'}
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-zinc-500">Carregando seus dados...</div>
            ) : progressList.length > 0 ? (
              <div className="space-y-2.5">
                {progressList.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-zinc-900 bg-black/60 p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                        {item.gameTitle || item.gameId}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
                        <span>Recorde:</span>
                        <span>{item.highScore || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-red-500" />
                        <span>Tempo: {formatSeconds(item.playTimeSeconds)}</span>
                      </span>
                      <span className="text-zinc-700">·</span>
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="h-3 w-3 text-red-500" />
                        <span>{item.sessionsCount || 1} partidas</span>
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-zinc-400 italic bg-zinc-950 p-2.5 rounded-lg border border-zinc-900">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 bg-black/40">
                <Gamepad2 className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">
                  Você ainda não salvou progresso em nenhum jogo.
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Ao jogar qualquer título, use o botão "Salvar Progresso" na barra do jogo!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="border-t border-zinc-900 pt-4 mt-4 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-zinc-600 font-mono">
            ID: {user.uid.slice(0, 10)}...
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
