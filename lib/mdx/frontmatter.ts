import yaml from "js-yaml";
import type { VFile } from "vfile";

// Code adapted from:
// - https://github.com/vfile/vfile-matter (I needed to add leading whitespace to the regex)

const frontmatterRegex = /^\s*---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/;

export function extractFrontmatter<T extends object>(file: string): T | null;
export function extractFrontmatter<T extends object>(file: VFile, strip?: boolean): T | null;
export function extractFrontmatter<T extends object>(file: VFile | string, strip = false) {
  const source = String(file);
  const match = frontmatterRegex.exec(source);
  if (match) {
    const frontmatter = (yaml.load(match[1]) ?? null) as T | null;
    strip && ((file as VFile).value = source.slice(match[0].length));
    return frontmatter;
  }
  return null;
}
