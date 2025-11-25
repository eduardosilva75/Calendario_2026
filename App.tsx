import React, { useState, useMemo } from 'react';
import Controls from './components/Controls';
import MonthGrid from './components/MonthGrid';
import { generateCalendarData } from './utils/dateUtils';
import { exportToExcel } from './utils/excelExport';

const App: React.FC = () => {
  const [startWeek, setStartWeek] = useState<number>(1);

  // Re-calculate calendar data when start week changes
  const calendarData = useMemo(() => generateCalendarData(startWeek), [startWeek]);

  const handleExport = () => {
    exportToExcel(calendarData, startWeek);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-100">
      {/* Sidebar Controls */}
      <Controls 
        startWeek={startWeek} 
        setStartWeek={setStartWeek} 
        onExport={handleExport} 
      />

      {/* Main Content (A4 Preview) */}
      <main className="flex-1 p-4 md:p-8 flex justify-center items-start overflow-auto">
        <div className="bg-white shadow-2xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] p-[10mm] md:p-[15mm] flex flex-col">
          
          {/* Header */}
          <header className="mb-8 text-center border-b pb-4">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">2026</h1>
            <p className="text-gray-500 mt-1 uppercase text-sm tracking-widest">Planeamento Anual • Portugal</p>
          </header>

          {/* Grid Layout: 2 Columns of Months */}
          <div className="flex-1 flex flex-col gap-6">
            {Array.from({ length: 6 }).map((_, rowIndex) => {
              const monthLeftIdx = rowIndex * 2;
              const monthRightIdx = rowIndex * 2 + 1;

              return (
                <div key={rowIndex} className="flex gap-4 items-stretch min-h-[140px]">
                  {/* Left Month */}
                  <div className="flex-1">
                    <MonthGrid 
                      monthIndex={monthLeftIdx} 
                      weeks={calendarData[monthLeftIdx]} 
                    />
                  </div>

                  {/* Spacer / Vacation Slot */}
                  <div className="w-16 md:w-24 border-x border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
                    <span className="text-gray-300 vertical-rl text-xs tracking-widest uppercase rotate-180 transform opacity-50 select-none">
                      Notas / Férias
                    </span>
                  </div>

                  {/* Right Month */}
                  <div className="flex-1">
                    <MonthGrid 
                      monthIndex={monthRightIdx} 
                      weeks={calendarData[monthRightIdx]} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <footer className="mt-8 text-center text-xs text-gray-400 print:text-gray-300">
            Gerado automaticamente - Ciclo Turnos 2026
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;