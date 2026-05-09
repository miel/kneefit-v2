export function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function autoTimeSlot() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export function painDisplay(value, scaleType) {
  if (scaleType === 'numeric') return `${value}/10`;
  return value;
}

export function painColor(value, scaleType) {
  if (scaleType === 'qualitative') {
    const map = { 'no pain': '#00d4aa', sensitive: '#ffb347', painful: '#ff8c42', 'sharp pain': '#ff6b6b' };
    return map[value] ?? 'var(--color-text-muted)';
  }
  const n = Number(value);
  if (n <= 3) return '#00d4aa';
  if (n <= 6) return '#ffb347';
  return '#ff6b6b';
}

export function isToday(isoDate) {
  return isoDate === todayISO();
}
