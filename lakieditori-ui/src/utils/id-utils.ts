export function encodeIdForUrl(s: string): string {
  return s.replace(/[/.]/g, '_');
}
