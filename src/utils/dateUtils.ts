// Utilidades de formato de fechas en español

export function getTodayIsoString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatSpanishDate(date: Date = new Date()): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  const str = new Intl.DateTimeFormat('es-ES', options).format(date);
  // Capitalizar la primera letra (ej. "Jueves, 15 de octubre de 2026")
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatTimeNow(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}
