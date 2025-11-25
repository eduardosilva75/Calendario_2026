import { Holiday, CycleWeek } from './types';

// JS Date: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
export const WEEKDAYS_PT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

// Mapping JS day index (0-6 where 0 is Sunday) to Array index above is done in logic.
// Logic uses ISO weekday (1=Mon...7=Sun) mostly, but Date.getDay() returns 0=Sun...6=Sat.

export const FERIADOS_PT_2026: Holiday[] = [
  { date: '2026-01-01', name: 'Ano Novo' },
  { date: '2026-02-17', name: 'Carnaval' },
  { date: '2026-04-03', name: 'Sexta-feira Santa' },
  { date: '2026-04-05', name: 'Domingo de Páscoa' },
  { date: '2026-04-25', name: 'Dia da Liberdade' },
  { date: '2026-05-01', name: 'Dia do Trabalhador' },
  { date: '2026-06-04', name: 'Corpo de Deus' },
  { date: '2026-06-10', name: 'Dia de Portugal' },
  { date: '2026-06-14', name: 'Dia da Cidade' },
  { date: '2026-08-15', name: 'Assunção de N. Sra.' },
  { date: '2026-10-05', name: 'Implantação da República' },
  { date: '2026-11-01', name: 'Todos os Santos' },
  { date: '2026-12-01', name: 'Restauração da Independência' },
  { date: '2026-12-08', name: 'Imaculada Conceição' },
  { date: '2026-12-25', name: 'Natal' },
];

// Cycle Definition from prompt
// S/D (Sat/Sun), 5/6 (Thu/Fri), 4/5 (Wed/Thu), 3/4 (Tue/Wed), 3/4 (Tue/Wed), 3/D (Tue/Sun)
// JS Indices: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
export const SHIFT_CYCLE: CycleWeek[] = [
  { id: 1, label: 'Semana 1 (S/D)', daysOff: [6, 0] },
  { id: 2, label: 'Semana 2 (5/6)', daysOff: [4, 5] }, // 5ª e 6ª feira (Thu, Fri)
  { id: 3, label: 'Semana 3 (4/5)', daysOff: [3, 4] }, // 4ª e 5ª feira (Wed, Thu)
  { id: 4, label: 'Semana 4 (3/4)', daysOff: [2, 3] }, // 3ª e 4ª feira (Tue, Wed)
  { id: 5, label: 'Semana 5 (3/4)', daysOff: [2, 3] }, // 3ª e 4ª feira (Tue, Wed)
  { id: 6, label: 'Semana 6 (3/D)', daysOff: [2, 0] }, // 3ª e Domingo
  // Repeats
  { id: 7, label: 'Semana 7 (S/D)', daysOff: [6, 0] },
  { id: 8, label: 'Semana 8 (5/6)', daysOff: [4, 5] },
  { id: 9, label: 'Semana 9 (4/5)', daysOff: [3, 4] },
  { id: 10, label: 'Semana 10 (3/4)', daysOff: [2, 3] },
  { id: 11, label: 'Semana 11 (3/4)', daysOff: [2, 3] },
  { id: 12, label: 'Semana 12 (3/D)', daysOff: [2, 0] },
];

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
