import { FERIADOS_PT_2026, SHIFT_CYCLE } from '../constants';
import { DayInfo } from '../types';

// Helper to format YYYY-MM-DD
export const formatDateStr = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const getWeekNumber = (d: Date): number => {
  // ISO week date calculation
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const generateCalendarData = (startShiftWeek: number): DayInfo[][][] => {
  const year = 2026;
  const monthsData: DayInfo[][][] = [];

  // Anchor date for cycle: Jan 5, 2026 is a Monday. 
  // We assume the user selects which cycle week starts on the week of Jan 5th.
  // Actually, to make it seamless, let's treat Jan 5th's ISO week as the anchor.
  // Jan 5, 2026 is ISO Week 2.
  // Let's use simpler logic: continuous weeks from Jan 5.
  
  const anchorDate = new Date(2026, 0, 5); // Jan 5
  
  for (let m = 0; m < 12; m++) {
    const monthDays: DayInfo[] = [];
    const firstDay = new Date(year, m, 1);
    const lastDay = new Date(year, m + 1, 0);
    
    // Fill days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const currentDate = new Date(year, m, d);
      const dayOfWeek = currentDate.getDay(); // 0-6
      const dateStr = formatDateStr(currentDate);
      
      const holiday = FERIADOS_PT_2026.find(h => h.date === dateStr);
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      let isShiftOff = false;

      // Only calculate cycle if startShiftWeek is greater than 0
      if (startShiftWeek > 0) {
        // Calculate shift cycle
        // Calculate difference in weeks from Anchor (Jan 5)
        // If date is before Jan 5, we reverse logic, but 2026 starts close enough.
        // We need the ISO week number.
        
        const currentWeekNum = getWeekNumber(currentDate);
        
        // Calculate "Cycle Index". 
        // If currentWeekNum is X, and StartShiftWeek is Y (meaning on Week 2 [Jan 5], cycle is Y)
        // Then offset is needed.
        // Jan 5 is Week 2. So at Week 2, index = startShiftWeek - 1 (0-based index).
        // Formula: (currentWeekNum - 2 + (startShiftWeek - 1)) % 12
        // We handle negative wrap around for first days of Jan if week 1.
        
        let rawIndex = (currentWeekNum - 2 + (startShiftWeek - 1)) % 12;
        if (rawIndex < 0) rawIndex += 12;
        
        const cycleWeek = SHIFT_CYCLE[rawIndex];
        isShiftOff = cycleWeek.daysOff.includes(dayOfWeek);
      }

      monthDays.push({
        date: currentDate,
        dayOfMonth: d,
        dayOfWeek,
        weekNumber: getWeekNumber(currentDate),
        isHoliday: !!holiday,
        holidayName: holiday?.name,
        isWeekend,
        isShiftOff,
        monthIndex: m
      });
    }
    
    // Group into weeks for rendering grid
    // We want the calendar to start on Monday.
    // If 1st is Wednesday, we need empty slots for Mon, Tue.
    const weeks: DayInfo[][] = [];
    let currentWeek: DayInfo[] = [];
    
    // Padding Start
    let firstDayOfWeek = firstDay.getDay(); // 0(Sun)..6(Sat)
    // Convert to Mon(0)..Sun(6) for loop logic? 
    // Let's stick to standard JS 0=Sun. 
    // We want Mon as first column.
    // Mon=1, Tue=2... Sat=6, Sun=0.
    
    let padCount = (firstDayOfWeek === 0 ? 7 : firstDayOfWeek) - 1;
    
    for (let i = 0; i < padCount; i++) {
        // @ts-ignore - Empty slots
      currentWeek.push(null);
    }
    
    monthDays.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Padding End
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        // @ts-ignore
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    monthsData.push(weeks);
  }
  
  return monthsData;
};