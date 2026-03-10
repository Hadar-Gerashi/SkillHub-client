
export const DAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export const PREVIEW_COUNT = 6;

export const CARD_TABS = ["About", "Details", "Sessions"];

export const parseLocalDate = (dateStr) => {
  const s = typeof dateStr === "string" ? dateStr : new Date(dateStr).toISOString();
  const [y, m, d] = s.substring(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};