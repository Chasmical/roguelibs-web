import { MDXRemoteProps } from "next-mdx-remote/rsc";
import { compileMDX as remoteCompileMDX, CompileMDXResult } from "next-mdx-remote/rsc";
import { RehypePlugins, RemarkPlugins } from "@lib/mdx/options";
import MdxComponents from "@lib/mdx/components";

export const MdxOptions: MDXRemoteProps["options"] = {
  parseFrontmatter: true,
  mdxOptions: {
    remarkPlugins: RemarkPlugins,
    rehypePlugins: RehypePlugins,
  },
};

export function compileMDX<Frontmatter = Record<string, unknown>>(
  source: string,
): Promise<CompileMDXResult<Frontmatter>> {
  return remoteCompileMDX<Frontmatter>({ source, components: MdxComponents, options: MdxOptions });
}
