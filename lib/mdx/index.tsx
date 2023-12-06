import { VFile, VFileCompatible } from "vfile";
import { compile, CompileOptions } from "@mdx-js/mdx";
import { extractFrontmatter } from "./frontmatter";
import { jsxRuntime } from "./jsx-runtime.cjs";
import type { MDXComponents } from "mdx/types";
import type { PluggableList } from "unified";

// Code adapted from:
// - https://github.com/hashicorp/next-mdx-remote

export interface MdxOptions {
  format?: "md" | "mdx";
  rehypePlugins: PluggableList;
  remarkPlugins: PluggableList;
  scope?: Record<string, unknown>;
  components?: MdxComponentProps["components"];
}

interface CompileResult<Frontmatter> {
  source: string;
  frontmatter: Frontmatter | null;
  Content: MdxComponent;
  content: React.ReactElement<MdxComponentProps>;
}

export async function compileMdx<Frontmatter extends object>(
  markdown: VFileCompatible,
  options: MdxOptions,
): Promise<CompileResult<Frontmatter>> {
  const vfile = new VFile(markdown);

  // TODO: remark-heading-id doesn't work with JSX, so we're escaping JSX acorns via regex
  const regex = /^(#{1,6} [^\n]+?)\s*({#[^\n]+})$/gm;
  vfile.value = String(vfile).replaceAll(regex, (match, title, id) => `${title} \\${id}`);

  const frontmatter = extractFrontmatter<Frontmatter>(vfile, true);

  const compileOptions: CompileOptions = {
    format: options.format ?? "md",
    rehypePlugins: options.rehypePlugins,
    remarkPlugins: options.remarkPlugins,
    outputFormat: "function-body",
    providerImportSource: undefined,
    development: process.env.NODE_ENV === "development",
  };

  const source = String(await compile(vfile, compileOptions));

  let component: MdxComponent | undefined;
  function getContentComponent() {
    return (component ??= createMdxComponent(source, { ...options.scope, ...frontmatter }));
  }
  let content: React.ReactElement<MdxComponentProps> | undefined;
  function getContent() {
    if (content) return content;
    const Content = getContentComponent();
    return (content = <Content components={options.components} />);
  }

  return {
    frontmatter,
    source,
    get Content() {
      return getContentComponent();
    },
    get content() {
      return getContent();
    },
  };
}

export interface MdxComponentProps {
  components: MDXComponents | null | undefined;
}
export type MdxComponent = React.FunctionComponent<MdxComponentProps>;

export function createMdxComponent(source: string, scope?: Record<string, unknown> | null): MdxComponent {
  scope = { opts: jsxRuntime, ...scope };

  const keys = Object.keys(scope);
  const values = Object.values(scope);

  const hydrate = Reflect.construct(Function, keys.concat(source));

  return hydrate.apply(hydrate, values).default;
}
