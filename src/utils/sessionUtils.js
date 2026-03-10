import Holidays from 'date-holidays';

const hd = new Holidays('IL');

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DAY_NAMES_HE = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const parseLocalDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const toDateStr = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-');

export const isPublicHoliday = (date) => {
  const holidays = hd.isHoliday(date);
  if (!holidays) return false;
  return holidays.some(h => h.type === 'public');
};

export const buildSessions = (openingDateStr, totalCount, days) => {
  if (!openingDateStr || !totalCount || !days.length) return { generated: [], skipped: [] };
  const start = parseLocalDate(openingDateStr);
  const weekBase = new Date(start);
  // מגיע לתחילת השבוע - ראשון של אותו שבוע
  weekBase.setDate(start.getDate() - start.getDay());
  const generated = [], skipped = [];
  let weekIndex = 0;
  while (generated.length < Number(totalCount)) {
    for (const dayNum of days) {
      if (generated.length >= Number(totalCount)) break;
      const candidate = new Date(weekBase);
      candidate.setDate(weekBase.getDate() + weekIndex * 7 + dayNum);
      if (candidate < start) continue;
      const dateStr = toDateStr(candidate);
      if (isPublicHoliday(candidate)) skipped.push(dateStr);
      else generated.push(dateStr);
    }
    weekIndex++;
  }
  return { generated, skipped };
};