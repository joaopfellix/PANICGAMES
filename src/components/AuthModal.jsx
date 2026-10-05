import React, { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from '../services/firebase';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Falha ao autenticar com Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (tab === 'login') {
        user = await loginWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          setError('Por favor informe seu nome ou apelido.');
          setLoading(false);
          return;
        }
        user = await registerWithEmail(email, password, displayName.trim());
      }
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    } catch (err) {
      let msg = 'Ocorreu um erro ao processar.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está em uso.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Formato de e-mail inválido.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              {tab === 'login' ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-100 uppercase tracking-wide">
                {tab === 'login' ? 'Entrar na Conta' : 'Criar Nova Conta'}
              </h3>
              <p className="text-xs text-slate-400">
                Salve seu progresso, recordes e estatísticas na nuvem.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              tab === 'login'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              tab === 'register'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Login Button */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-100 hover:bg-slate-800 hover:border-slate-600 transition-colors mb-4 shadow-sm"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continuar com Google</span>
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Ou use seu e-mail
          </span>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Nome ou Apelido
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Player1, ShadowNinja"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Pelo menos 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/25 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : tab === 'login' ? (
              <span>Entrar no PANIC GAMES</span>
            ) : (
              <span>Criar Minha Conta</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
