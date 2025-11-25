export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface DayInfo {
  date: Date;
  dayOfMonth: number;
  dayOfWeek: number; // 0 (Sun) - 6 (Sat)
  weekNumber: number;
  isHoliday: boolean;
  holidayName?: string;
  isWeekend: boolean;
  isShiftOff: boolean;
  monthIndex: number; // 0-11
}

export interface CycleWeek {
  id: number;
  label: string;
  daysOff: number[]; // 0=Sun, 1=Mon, ... 6=Sat
}