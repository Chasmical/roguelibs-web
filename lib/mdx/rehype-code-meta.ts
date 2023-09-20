import type { Transformer } from "unified";
import { visitParents } from "unist-util-visit-parents";

export interface RehypeCodeMetaOptions {}

export default function rehypeCodeMeta(options?: RehypeCodeMetaOptions): Transformer {
  return (tree: any) => {
    visitParents(tree, "element", (child, ancestors) => {
      if (child.tagName !== "code") return;
      const parent = ancestors.at(-1);
      if (parent.tagName !== "pre") return;

      Object.assign((parent.properties ??= {}), parseMeta(child.data?.meta));

      const classNames = child.properties?.className;
      const className = Array.isArray(classNames) ? classNames[0] : classNames;
      if (className) {
        parent.properties.lang = className?.replace(/lang(?:uage)?-/, "");
      }
    });
  };
}

const MetaAttributeRegex = /([^\s=]+)(?:="([^"]+)"|=([^\s]+))?/g;

function parseMeta(meta: string | null | undefined): Record<string, unknown> | void {
  meta = meta?.trim();
  if (meta) {
    const matches = [...meta.matchAll(MetaAttributeRegex)];
    const entries = matches.map(([, key, quoted, unquoted]) => [key, quoted ?? unquoted ?? true]);
    return Object.fromEntries(entries);
  }
}
