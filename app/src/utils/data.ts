/**
 * Trims out empty spaces from the given string & leftover single dash and returns cleaned string
 * @param s String to be cleaned
 */
export function cleanData(s: string | null | undefined): string {
  const cleaned = (s || '').trim()
  if (cleaned === '-') return ''
  return cleaned
}

/**
 * Parses the given string with commas as float and returns that
 * @param n String to be parsed as float
 */
export function parseFloatString(n: string): number {
  return parseFloat(n.replace(/,/g, '') || '0')
}
