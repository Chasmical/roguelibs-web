import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

export interface RemarkInlineHexColorOptions {}

const ColorRegex = /^#([0-9a-fA-F]{6})$/;

export default function remarkInlineHexColor(options?: RemarkInlineHexColorOptions): Transformer {
  return (tree: any) => {
    visit(tree, "inlineCode", node => {
      if (node.value?.[0] !== "#" || !ColorRegex.test(node.value)) return;

      Object.assign(node, {
        type: "mdxJsxFlowElement",
        name: "InlineHexColor",
        attributes: [{ type: "mdxJsxAttribute", name: "color", value: node.value }],
      });
    });
  };
}
