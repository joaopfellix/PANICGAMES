import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Trophy,
  Clock,
  Gamepad2,
  LogOut,
  Calendar,
  Sparkles,
  CheckCircle2,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Jogador'}
                referrerPolicy="no-referrer"
                className="h-11 w-11 rounded-full border-2 border-rose-500 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-500/20 border-2 border-rose-500 text-rose-400 font-heading font-black text-lg">
                {(user.displayName || user.email || 'J')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-100 flex items-center gap-1.5">
                <span>{user.displayName || 'Jogador'}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                  Online
                </span>
              </h3>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span>Progresso & Estatísticas de Jogos</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-500">
                {progressList.length} {progressList.length === 1 ? 'salvo' : 'salvos'}
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Carregando seus dados...</div>
            ) : progressList.length > 0 ? (
              <div className="space-y-2.5">
                {progressList.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-slate-200">
                        {item.gameTitle || item.gameId}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                        <span>Recorde:</span>
                        <span>{item.highScore || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>Tempo: {formatSeconds(item.playTimeSeconds)}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="h-3 w-3 text-slate-500" />
                        <span>{item.sessionsCount || 1} partidas</span>
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
                <Gamepad2 className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">
                  Você ainda não salvou progresso em nenhum jogo.
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ao jogar qualquer título, use o botão "Salvar Progresso" na barra do jogo!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Logout */}
        <div className="border-t border-slate-800 pt-4 mt-4 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            ID: {user.uid.slice(0, 10)}...
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair da Conta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
