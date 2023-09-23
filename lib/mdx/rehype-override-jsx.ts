import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

export interface RehypeOverrideJsxOptions {}

// MDX only converts markdown nodes to custom components, and leaves JSX as is.
// This plugin allows overriding JSX native elements with custom components as well.
// See also: https://github.com/mdx-js/mdx/pull/2050, https://github.com/mdx-js/mdx/pull/2052

export default function rehypeOverrideJsx(options?: RehypeOverrideJsxOptions): Transformer {
  return (tree: any) => {
    visit(tree, node => void delete node.data?._mdxExplicitJsx);
  };
}
