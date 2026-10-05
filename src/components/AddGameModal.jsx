import React, { useState } from 'react';
import { X, Plus, Code2, AlertCircle } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('Setas / WASD: Mover\nEspaço: Ação');
  const [accentColor, setAccentColor] = useState('#10b981');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor informe o título do jogo.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Por favor informe o link ou código do iframe.');
      return;
    }

    // Extract src if user pasted a full <iframe src="..." ...> tag
    let src = iframeInput.trim();
    const match = src.match(/src=["'](.*?)["']/);
    if (match && match[1]) {
      src = match[1];
    }

    const newGame = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      category: category.trim(),
      description: description.trim() || 'Jogo personalizado adicionado pelo usuário.',
      iframeSrc: src,
      iframeHtml: `<iframe src="${src}" title="${title.trim()}" allow="fullscreen; autoplay" style="width:100%;height:100%;border:none;"></iframe>`,
      controls: controls
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean),
      accentColor,
      badge: 'Personalizado',
      plays: '1 play',
      rating: 5.0,
      isCustom: true,
      addedAt: Date.now(),
    };

    onAddGame(newGame);
    onClose();
    // Reset form
    setTitle('');
    setIframeInput('');
    setDescription('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Code2 className="h-4 w-4" />
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-100">
              Adicionar Jogo em Iframe
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Título do Jogo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Pacman 3D, Super Mario HTML5..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Clássicos">Clássicos</option>
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Ação">Ação</option>
                <option value="Esportes">Esportes</option>
                <option value="Estratégia">Estratégia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                Cor de Destaque
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-slate-700 bg-slate-950 p-1"
                />
                <span className="text-xs font-mono text-slate-400">{accentColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              URL ou Tag &lt;iframe&gt; do Jogo *
            </label>
            <textarea
              required
              rows={2}
              placeholder='Cole o link direto (https://...) ou código completo <iframe src="..."></iframe>'
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Descrição Curta
            </label>
            <input
              type="text"
              placeholder="Breve descrição do objetivo do jogo"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
              Instruções de Teclas (uma por linha)
            </label>
            <textarea
              rows={2}
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 transition-colors shadow-sm shadow-emerald-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>Salvar Jogo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
