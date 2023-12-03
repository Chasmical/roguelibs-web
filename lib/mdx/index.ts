import { MDXRemoteProps } from "next-mdx-remote/rsc";
import { compileMDX as remoteCompileMDX, CompileMDXResult } from "next-mdx-remote/rsc";
import { RehypePlugins, RemarkPlugins } from "@lib/mdx/options";
import MdxComponents from "@lib/mdx/components";
import { Draft, produce } from "immer";
import type { Transformer } from "unified";
import remarkGitHub from "@lib/mdx/remark-github";

export type MDXComponents = NonNullable<MDXRemoteProps["components"]>;
export type MDXOptions = NonNullable<MDXRemoteProps["options"]>;

export const MdxOptions: MDXOptions = {
  parseFrontmatter: true,
  mdxOptions: {
    format: "md" as const,
    remarkPlugins: RemarkPlugins,
    rehypePlugins: RehypePlugins,
  },
};

interface MdxCompileOptions {
  format?: "md" | "mdx";
  github_repo?: string | null;
}

export function compileMDX<Frontmatter = Record<string, unknown>>(
  source: string,
  opt?: MdxCompileOptions,
): Promise<CompileMDXResult<Frontmatter>> {
  const components = MdxComponents;

  const options = produce(MdxOptions, mdxOptions => {
    if (opt?.format) {
      mdxOptions.mdxOptions!.format = opt.format;
    }
    if (opt?.github_repo) {
      configurePlugin(mdxOptions, remarkGitHub, o => (o.repo = opt.github_repo!));
    }
  });

  return remoteCompileMDX<Frontmatter>({ source, components, options });
}

function configurePlugin<Options>(
  mdxOptions: MDXOptions,
  target: (opt: Options) => Transformer,
  configure: (opt: Draft<NonNullable<Options>>) => void,
) {
  const plugins = mdxOptions.mdxOptions?.remarkPlugins ?? [];
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    if (Array.isArray(plugin)) {
      if (plugin[0] === target) {
        const options = (plugin[1] ?? {}) as NonNullable<Options>;
        plugin[1] = produce(options, o => void configure(o));
        return;
      }
    } else if (plugin === target) {
      const options = {} as NonNullable<Options>;
      plugins[i] = [target, produce(options, o => void configure(o))];
      return;
    }
  }
}
