import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

export interface RemarkAdmonitionOptions {
  componentName?: string;
}

export default function remarkAdmonition(options?: RemarkAdmonitionOptions): Transformer {
  const componentName = options?.componentName ?? "Admonition";

  return (tree: any) => {
    visit(tree, node => {
      if (node.type === "containerDirective") {
        node.attributes = [
          { type: "mdxJsxAttribute", name: "type", value: node.name },
          ...Object.entries(node.attributes).map(([name, value]) => ({ type: "mdxJsxAttribute", name, value })),
        ];
        node.type = "mdxJsxFlowElement";
        node.name = componentName;
      }
    });
  };
}
