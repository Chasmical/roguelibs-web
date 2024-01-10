declare module "@twemoji/parser" {
  export function toCodePoints(unicodeSurrogates: string): string[];
}
declare module "@twemoji/parser/dist/lib/regex" {
  const regex: RegExp;
  export default regex;
}
