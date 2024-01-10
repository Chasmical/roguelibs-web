import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

const directiveTypes = ["containerDirective", "leafDirective", "textDirective"] as const;
type DirectiveType = (typeof directiveTypes)[number];

interface DirectiveInfo {
  inline?: boolean;
  types?: DirectiveType | DirectiveType[];
}

type ResolveComponentFunc = (name: string, type: DirectiveType) => string | [string, DirectiveInfo] | undefined;
type ResolveComponentMap = Record<string, string | [string, DirectiveInfo]>;
type ResolveComponentList = [string | string[], string, DirectiveInfo?][];

export interface RemarkAdmonitionOptions {
  resolveComponent?: ResolveComponentFunc | ResolveComponentMap | ResolveComponentList;
}

function resolveComponentFunc(res: NonNullable<RemarkAdmonitionOptions["resolveComponent"]>): ResolveComponentFunc {
  if (typeof res === "function") return res;
  if (Array.isArray(res)) {
    res.forEach(arr => typeof arr[0] === "string" && (arr[0] = arr[0].split("|")));
    return name => {
      const entry = res.find(a => a[0].includes(name));
      return entry && [entry[1], entry[2]!];
    };
  }
  return name => res[name];
}

export default function remarkAdmonition(options?: RemarkAdmonitionOptions): Transformer {
  const resolveComponent = resolveComponentFunc(options?.resolveComponent ?? (() => "Admonition"));

  return (tree: any) => {
    visit(tree, node => {
      if (directiveTypes.includes(node.type)) {
        const res = resolveComponent(node.name, node.type);

        const componentName = Array.isArray(res) ? res[0] : res;
        const info = (Array.isArray(res) && res[1]) || {};
        const validTypes = typeof info.types === "string" ? [info.types] : info.types ?? directiveTypes;

        if (componentName && validTypes.includes(node.type)) {
          const type = info.inline ? node.children?.[0]?.value : node.name;

          node.attributes = [
            { type: "mdxJsxAttribute", name: "type", value: type },
            ...Object.entries(node.attributes).map(([name, value]) => ({ type: "mdxJsxAttribute", name, value })),
          ];
          node.type = "mdxJsxFlowElement";
          node.name = componentName;
          if (info.inline) node.children = [];
        }
      }
    });
  };
}
