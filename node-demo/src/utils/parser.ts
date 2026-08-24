// Parse an ISO-8601 date string and return a Date object.
// Return null if invalid. Do not throw.
export function parseDate(dateString: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/.test(dateString)) {
    return null;
  }

  try {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

