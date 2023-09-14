import Code from "@components/Common/Code";
import CodeBlock from "@components/Common/CodeBlock";
import type { MDXComponents } from "mdx/types";
import { MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-custom-heading-id";
import { compileMDX as remoteCompileMDX, CompileMDXResult } from "next-mdx-remote/rsc";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
import Admonition from "@components/Common/Admonition";
import Link from "@components/Common/Link";

export const MdxComponents: MDXComponents = {
  code: Code,
  pre: CodeBlock,
  Admonition: Admonition,
  a: Link as never,
};

export const MdxOptions: MDXRemoteProps["options"] = {
  parseFrontmatter: true,
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkHeadingId as never, remarkDirective, remarkAdmonition],
    rehypePlugins: [],
  },
};

export function compileMDX<Frontmatter = Record<string, unknown>>(
  source: string,
): Promise<CompileMDXResult<Frontmatter>> {
  return remoteCompileMDX<Frontmatter>({ source, components: MdxComponents, options: MdxOptions });
}

export function remarkAdmonition() {
  return (tree: any) => {
    visit(tree, node => {
      if (node.type === "textDirective" || node.type === "leafDirective" || node.type === "containerDirective") {
        // if (!["note", "tip", "info", "caution", "danger"].includes(node.name)) return;

        node.attributes = [
          { type: "mdxJsxAttribute", name: "type", value: node.name },
          { type: "mdxJsxAttribute", name: "title", value: node.attributes.title },
        ];
        node.type = "mdxJsxFlowElement";
        node.name = "Admonition";
      }
    });
  };
}
