import React from 'react';
import { SHIFT_CYCLE } from '../constants';
import { Download, Printer, Settings } from 'lucide-react';

interface Props {
  startWeek: number;
  setStartWeek: (id: number) => void;
  onExport: () => void;
}

const Controls: React.FC<Props> = ({ startWeek, setStartWeek, onExport }) => {
  return (
    <div className="w-full md:w-72 bg-white shadow-lg p-6 flex flex-col gap-6 no-print md:h-screen md:sticky md:top-0 overflow-y-auto z-50">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Calendário 2026</h1>
        <p className="text-sm text-gray-500">Planeamento de Turnos - Portugal</p>
      </div>

      {/* Cycle Configuration */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <Settings className="w-4 h-4" />
          <span>Configurar Ciclo</span>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          Selecione qual semana do ciclo corresponde à primeira semana completa de Janeiro (5 Jan - 11 Jan).
        </p>
        
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
          Início do Ciclo
        </label>
        <select
          value={startWeek}
          onChange={(e) => setStartWeek(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value={0}>Sem Ciclo (Horário Normal)</option>
          {SHIFT_CYCLE.map((week) => (
            <option key={week.id} value={week.id}>
              {week.label}
            </option>
          ))}
        </select>
        
        <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100 text-xs text-blue-800">
          <span className="font-bold">Legenda:</span>
          <ul className="mt-1 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-100 border border-red-200 block rounded-sm"></span>
              Feriado
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-teal-100 border border-teal-200 block rounded-sm"></span>
              Folga (Turno)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 bg-slate-100 border border-slate-200 block rounded-sm"></span>
              Fim de Semana
            </li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-3">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors text-sm font-medium"
        >
          <Printer className="w-4 h-4" />
          Imprimir / PDF
        </button>
        <button
          onClick={onExport}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Baixar Excel
        </button>
      </div>
    </div>
  );
};

export default Controls;