import type { PluggableList } from "unified";
import type { MdxOptions } from "@lib/mdx";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import remarkDirective from "remark-directive";
import remarkAdmonition, { RemarkAdmonitionOptions } from "./remark-admonition";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import remarkMentions from "./remark-mentions";
import remarkInlineCssColor from "./remark-inline-css-color";
import remarkEmoji from "./remark-emoji";
import remarkEmbed, { RemarkEmbedOptions } from "./remark-embed";
import remarkGitHub, { RemarkGitHubOptions } from "./remark-github";
import rehypeOverrideJsx from "./rehype-override-jsx";
import rehypeCodeMeta from "./rehype-code-meta";
import rehypeKatex from "rehype-katex";

export default function configurePlugins(
  config?: RemarkConfiguration & RehypeConfiguration,
): Pick<MdxOptions, "remarkPlugins" | "rehypePlugins"> {
  return {
    remarkPlugins: configureRemarkPlugins(config),
    rehypePlugins: configureRehypePlugins(config),
  };
}

// TODO: remark-heading-id doesn't work with JSX (see workaround in mdx/index.ts)

export interface RemarkConfiguration {
  gitHubRepo?: string | null;
}
export function configureRemarkPlugins(config?: RemarkConfiguration): PluggableList {
  return [
    remarkGfm,
    remarkHeadingId,
    remarkDirective,
    [
      remarkAdmonition,
      {
        resolveComponent: [
          ["note|tip|info|caution|danger", "Admonition", { types: "containerDirective" }],
          ["icon", "Icon", { inline: true, types: "textDirective" }],
        ],
      } as RemarkAdmonitionOptions,
    ],
    remarkBreaks,
    [remarkMath, { singleDollarTextMath: false }],
    remarkMentions,
    remarkInlineCssColor,
    remarkEmoji,
    [remarkEmbed, { size: [400, 225], componentNames: [["YouTube", "YouTubeEmbed"]] } as RemarkEmbedOptions],
    [remarkGitHub, { repo: config?.gitHubRepo } as RemarkGitHubOptions],
  ];
}

export interface RehypeConfiguration {}
export function configureRehypePlugins(config?: RehypeConfiguration): PluggableList {
  return [rehypeOverrideJsx, rehypeCodeMeta, [rehypeKatex, { throwOnError: false, errorColor: "#FF0000" }]];
}
