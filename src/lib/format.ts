export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-IN', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      hour: opts.hour ?? '2-digit',
      minute: opts.minute ?? '2-digit',
      second: opts.second ?? '2-digit',
      hour12: opts.hour12 ?? true, // 12-hour format
      ...opts
    }).format(new Date(date));
  } catch (_err) {
    return '';
  }
}
