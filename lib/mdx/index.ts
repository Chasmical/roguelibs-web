import { MDXRemoteProps } from "next-mdx-remote/rsc";
import { compileMDX as remoteCompileMDX, CompileMDXResult } from "next-mdx-remote/rsc";
import { RehypePlugins, RemarkPlugins } from "@lib/mdx/options";
import MdxComponents from "@lib/mdx/components";
import { produce } from "immer";

export type MDXComponents = NonNullable<MDXRemoteProps["components"]>;
export type MDXOptions = NonNullable<MDXRemoteProps["options"]>;

const mdxOptions = {
  parseFrontmatter: true,
  mdxOptions: {
    remarkPlugins: RemarkPlugins,
    rehypePlugins: RehypePlugins,
  },
};
export const MdxOptions: MDXOptions = mdxOptions;

export function compileMDX<Frontmatter = Record<string, unknown>>(
  source: string,
  configure?: (options: typeof mdxOptions & MDXOptions, components: MDXComponents) => void,
): Promise<CompileMDXResult<Frontmatter>> {
  const { options, components } = produce({ options: MdxOptions, components: MdxComponents }, draft => {
    configure?.(draft.options as any, draft.components);
  });
  return remoteCompileMDX<Frontmatter>({ source, options, components });
}
