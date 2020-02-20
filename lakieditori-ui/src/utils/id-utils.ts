export function encodeIdForUrl(s: string): string {
  return encodeURI(s.replace(/[/.]/g, '_'));
}
