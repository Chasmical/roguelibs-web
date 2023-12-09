import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

export interface RemarkInlineCssColorOptions {
  // TODO: add extra colors?
}

const num = String.raw`\d*(?:\.\d*)?`;
const hue = `${num}(?:deg|grad|rad|turn)?`;

const colorFuncs = [
  // Hex colors: #000, #0000, #000000, #00000000
  `#[0-9a-fA-F]{3,4}`,
  `#[0-9a-fA-F]{6}`,
  `#[0-9a-fA-F]{8}`,
  // Legacy rgb/rgba: rgb(1,2,3), rgba(1,2,3,4)
  String.raw`rgb\(\s*${num}\s*,\s*${num}\s*,\s*${num}\s*\)`,
  String.raw`rgba\(\s*(?:${num}%|0)\s*,\s*(?:${num}%|0)\s*,\s*(?:${num}%|0)\s*,\s*${num}%?\s*\)`,
  // Modern rgb/rgba: rgba(1 2 3 / 0.5)
  String.raw`rgba?\(\s*${num}\s*${num}\s*${num}\s*(?:/\s*${num}%?\s*)?\)`,
  String.raw`rgba?\(\s*(?:${num}%|0)\s*(?:${num}%|0)\s*(?:${num}%|0)\s*(?:/\s*${num}%?\s*)?\)`,
  // Legacy hsl/hsla: hsl(1deg,2%,3%)
  String.raw`hsl\(\s*${hue}\s*,${num}%\s*,\s*${num}%\s*\)`,
  String.raw`hsla\(\s*${hue}\s*,(?:${num}%|0)\s*,\s*(?:${num}%|0)\s*,\s*${num}%?\s*\)`,
  // Modern hsl/hsla/hwb: hsla(1deg 2% 3% / 0.5)
  String.raw`h(?:sla?|wb)\(\s*${hue}\s*${num}\s*${num}\s*(?:/\s*${num}\s*)?\)`,
  String.raw`h(?:sla?|wb)\(\s*${hue}\s*(?:${num}%|0)\s*(?:${num}%|0)\s*(?:/\s*${num}%?\s*)?\)`,
];

export const ColorRegex = new RegExp(`^(${colorFuncs.join("|")})$`);

export default function remarkInlineCssColor(options?: RemarkInlineCssColorOptions): Transformer {
  return (tree: any) => {
    visit(tree, "inlineCode", node => {
      if (!ColorRegex.test(node.value)) return;

      Object.assign(node, {
        type: "mdxJsxFlowElement",
        name: "InlineHexColor",
        attributes: [{ type: "mdxJsxAttribute", name: "color", value: node.value }],
      });
    });
  };
}
