import React, { useState } from 'react';
import { BookOpen, GraduationCap, Undo2 } from 'lucide-react';

export const DisguiseView = ({ onExit }) => {
  const [calcInput, setCalcInput] = useState('0');
  const [activeTab, setActiveTab] = useState('classroom');

  const handleCalcClick = (val) => {
    if (val === 'C') {
      setCalcInput('0');
    } else if (val === '=') {
      try {
        // Safe evaluation of basic math expression
        const clean = calcInput.replace(/[^0-9+\-*/.]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`"use strict"; return (${clean})`)();
        setCalcInput(String(res));
      } catch (e) {
        setCalcInput('Erro');
      }
    } else {
      setCalcInput((prev) => (prev === '0' || prev === 'Erro' ? val : prev + val));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-slate-800 font-sans select-none">
      {/* Top Disguise Google Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 leading-tight">
              Google Sala de Aula
            </h1>
            <p className="text-xs text-slate-500">Turma 3º Ano B · Matemática e Ciências</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs">
            <button
              onClick={() => setActiveTab('classroom')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'classroom' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'
              }`}
            >
              Mural da Turma
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'calculator' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'
              }`}
            >
              Calculadora
            </button>
          </div>

          {/* Discreet Exit Button */}
          <button
            onClick={onExit}
            title="Voltar aos Jogos"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span>Retornar</span>
          </button>
        </div>
      </header>

      {/* Main Classroom Body */}
      <main className="flex-1 overflow-auto bg-slate-50 p-6">
        <div className="mx-auto max-w-4xl">
          {activeTab === 'classroom' ? (
            <div className="space-y-6">
              {/* Classroom Banner */}
              <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                  Ano Letivo 2026
                </span>
                <h2 className="text-2xl font-bold mt-1">Ciências Exatas & Física Aplicada</h2>
                <p className="text-sm text-emerald-50 mt-1">Prof. Ricardo Mendes · Sala 14</p>
              </div>

              {/* Assignments List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Próximas Tarefas & Leituras
                </h3>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Exercícios de Cinemática e Vetores — Capítulo 4
                        </h4>
                        <p className="text-xs text-slate-500">
                          Postado hoje às 08:30 · Prazo de entrega: Sexta-feira, 23:59
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                      Atribuído
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Relatório do Laboratório de Termodinâmica
                        </h4>
                        <p className="text-xs text-slate-500">
                          Postado ontem · Prazo de entrega: Segunda-feira
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                      Em andamento
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Fully Working Disguise Calculator */
            <div className="mx-auto max-w-xs rounded-xl border border-slate-200 bg-white p-5 shadow-md">
              <div className="mb-4 rounded-lg bg-slate-100 p-4 text-right font-mono text-2xl font-bold text-slate-800 overflow-x-auto">
                {calcInput}
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
                {['C', '(', ')', '/'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleCalcClick(k)}
                    className="rounded-lg bg-slate-200 py-3 text-slate-800 hover:bg-slate-300 transition-colors"
                  >
                    {k}
                  </button>
                ))}
                {['7', '8', '9', '*'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleCalcClick(k)}
                    className="rounded-lg bg-slate-100 py-3 text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    {k}
                  </button>
                ))}
                {['4', '5', '6', '-'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleCalcClick(k)}
                    className="rounded-lg bg-slate-100 py-3 text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    {k}
                  </button>
                ))}
                {['1', '2', '3', '+'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleCalcClick(k)}
                    className="rounded-lg bg-slate-100 py-3 text-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    {k}
                  </button>
                ))}
                {['0', '.', '=', '%'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleCalcClick(k)}
                    className={`rounded-lg py-3 transition-colors ${
                      k === '='
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
