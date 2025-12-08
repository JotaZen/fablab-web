// Configuración por defecto
const DEFAULT_LOCALE = "es-ES";
const DEFAULT_TIMEZONE = undefined; // undefined usa la zona horaria del navegador

/**
 * Formatea una fecha a "7 de diciembre de 2024"
 */
export function formatDate(date: Date | string | undefined | null, locale = DEFAULT_LOCALE): string {
  if (!date) return '-';
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!isValidDate(dateObj)) return '-';

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: DEFAULT_TIMEZONE,
    }).format(dateObj);
  } catch (e) {
    return '-';
  }
}

/**
 * Formatea una fecha a "07 dic 2024" (Corto)
 */
export function formatDateShort(date: Date | string | undefined | null, locale = DEFAULT_LOCALE): string {
  if (!date) return '-';
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!isValidDate(dateObj)) return '-';

    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: DEFAULT_TIMEZONE,
    }).format(dateObj);
  } catch {
    return '-';
  }
}

/**
 * Formatea fecha y hora: "07 dic 2024, 14:30"
 */
export function formatDateTime(date: Date | string | undefined | null, locale = DEFAULT_LOCALE): string {
  if (!date) return '-';
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!isValidDate(dateObj)) return '-';

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: DEFAULT_TIMEZONE,
    }).format(dateObj);
  } catch {
    return '-';
  }
}

export function formatRelativeTime(date: Date | string | undefined | null, locale = DEFAULT_LOCALE): string {
  if (!date) return '-';
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!isValidDate(dateObj)) return '-';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, "second");
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
    }
  } catch {
    return '-';
  }
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}
