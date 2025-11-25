import ExcelJS from 'exceljs';
import FileSaver from 'file-saver';
import { DayInfo } from '../types';
import { MONTH_NAMES, WEEKDAYS_PT } from '../constants';

const borderStyle: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
  right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
};

const fillWeekend: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFEBF2FF' } // Light Blue/Gray
};

const fillHoliday: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFFFEBEB' } // Light Red/Pink
};

const fillShiftOff: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFE6FFFA' } // Light Teal/Green
};

const fontHeader: Partial<ExcelJS.Font> = {
  name: 'Arial',
  size: 14,
  bold: true
};

const fontDay: Partial<ExcelJS.Font> = {
  name: 'Arial',
  size: 10
};

export const exportToExcel = async (monthsData: DayInfo[][][], startWeek: number) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Calendário 2026', {
    views: [{ showGridLines: false }]
  });

  // Title
  sheet.mergeCells('A1:O1');
  const titleCell = sheet.getCell('A1');
  
  const titleText = startWeek > 0 
    ? `Planeamento 2026 - Ciclo iniciado na Semana ${startWeek}`
    : `Planeamento 2026 - Sem Ciclo de Turnos`;
  
  titleCell.value = titleText;
  titleCell.font = { name: 'Arial', size: 18, bold: true };
  titleCell.alignment = { horizontal: 'center' };

  let currentRow = 3;

  // Loop through months in pairs (0 & 1, 2 & 3...)
  for (let i = 0; i < 12; i += 2) {
    const leftMonthIdx = i;
    const rightMonthIdx = i + 1;

    // Headers Row (Month Names)
    const leftMonthName = MONTH_NAMES[leftMonthIdx];
    const rightMonthName = MONTH_NAMES[rightMonthIdx];

    // Left Month Header
    sheet.mergeCells(`A${currentRow}:G${currentRow}`);
    const cellLeftHeader = sheet.getCell(`A${currentRow}`);
    cellLeftHeader.value = leftMonthName;
    cellLeftHeader.font = fontHeader;
    cellLeftHeader.alignment = { horizontal: 'center' };

    // Spacer Column (H)
    
    // Right Month Header
    sheet.mergeCells(`I${currentRow}:O${currentRow}`);
    const cellRightHeader = sheet.getCell(`I${currentRow}`);
    cellRightHeader.value = rightMonthName;
    cellRightHeader.font = fontHeader;
    cellRightHeader.alignment = { horizontal: 'center' };

    currentRow++;

    // Weekday Headers
    const daysHeaderRow = sheet.getRow(currentRow);
    // Left
    WEEKDAYS_PT.forEach((d, idx) => {
      const cell = daysHeaderRow.getCell(1 + idx); // A-G
      cell.value = d;
      cell.font = { bold: true, color: { argb: 'FF666666' } };
      cell.alignment = { horizontal: 'center' };
      cell.border = { bottom: { style: 'thick', color: { argb: 'FF999999'} } };
    });
    // Right
    WEEKDAYS_PT.forEach((d, idx) => {
      const cell = daysHeaderRow.getCell(9 + idx); // I-O
      cell.value = d;
      cell.font = { bold: true, color: { argb: 'FF666666' } };
      cell.alignment = { horizontal: 'center' };
      cell.border = { bottom: { style: 'thick', color: { argb: 'FF999999'} } };
    });

    currentRow++;

    // Days Data
    const leftWeeks = monthsData[leftMonthIdx];
    const rightWeeks = monthsData[rightMonthIdx];
    const maxWeeks = Math.max(leftWeeks.length, rightWeeks.length);

    for (let w = 0; w < maxWeeks; w++) {
      const row = sheet.getRow(currentRow);
      row.height = 30; // More space as requested

      // Left Month Days
      const lWeek = leftWeeks[w] || [null,null,null,null,null,null,null];
      lWeek.forEach((day, idx) => {
        const cell = row.getCell(1 + idx);
        if (day) {
          cell.value = day.dayOfMonth;
          cell.font = fontDay;
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = borderStyle;

          if (day.isHoliday) {
            cell.fill = fillHoliday;
            cell.note = day.holidayName;
          } else if (day.isShiftOff) {
            cell.fill = fillShiftOff;
          } else if (day.isWeekend) {
            cell.fill = fillWeekend;
          }
        }
      });

      // Spacer Column H - "Férias"
      const spacerCell = row.getCell(8);
      spacerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }; // White
      spacerCell.border = { left: {style: 'none'}, right: {style: 'none'}};


      // Right Month Days
      const rWeek = rightWeeks[w] || [null,null,null,null,null,null,null];
      rWeek.forEach((day, idx) => {
        const cell = row.getCell(9 + idx);
        if (day) {
          cell.value = day.dayOfMonth;
          cell.font = fontDay;
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = borderStyle;

          if (day.isHoliday) {
            cell.fill = fillHoliday;
            cell.note = day.holidayName;
          } else if (day.isShiftOff) {
            cell.fill = fillShiftOff;
          } else if (day.isWeekend) {
            cell.fill = fillWeekend;
          }
        }
      });

      currentRow++;
    }
    
    // Add gap row between month pairs
    currentRow++;
  }

  // Set widths
  // Cols A-G: width 5
  // Col H: width 20 (Spacer)
  // Cols I-O: width 5
  for(let c=1; c<=15; c++) {
    const col = sheet.getColumn(c);
    if (c === 8) col.width = 15; // Spacer
    else col.width = 6;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Handle various module formats for file-saver
  // @ts-ignore
  const save = FileSaver.saveAs || FileSaver;
  save(blob, 'Calendario_Portugal_2026.xlsx');
};