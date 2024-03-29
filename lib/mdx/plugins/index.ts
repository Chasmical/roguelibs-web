import type { PluggableList } from "unified";
import type { MdxOptions } from "@lib/mdx";
import remarkGfm from "remark-gfm";
// import remarkCustomHeadingId from "remark-custom-heading-id";
import remarkHeadingId from "remark-heading-id";
import remarkDirective from "remark-directive";
import remarkAdmonition from "./remark-admonition";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
// import remarkExtendedTable from "remark-extended-table";
import remarkMentions from "./remark-mentions";
import remarkInlineCssColor from "./remark-inline-css-color";
import remarkEmoji from "./remark-emoji";
import remarkEmbed from "./remark-embed";
import remarkGitHub from "./remark-github";
import rehypeKatex from "rehype-katex";
import rehypeCodeMeta from "./rehype-code-meta";
import rehypeOverrideJsx from "./rehype-override-jsx";

export default function configurePlugins(
  config?: RemarkConfiguration & RehypeConfiguration,
): Pick<MdxOptions, "remarkPlugins" | "rehypePlugins"> {
  return {
    remarkPlugins: configureRemarkPlugins(config),
    rehypePlugins: configureRehypePlugins(config),
  };
}

// TODO: remark-heading-id doesn't work with JSX (see workaround in mdx/index.ts),
// TODO: and remark-custom-heading-id is just broken, I think

// TODO: test if remark-extended-table still works

export interface RemarkConfiguration {
  gitHubRepo?: string | null;
}
export function configureRemarkPlugins(config?: RemarkConfiguration): PluggableList {
  return [
    remarkGfm,
    // remarkCustomHeadingId,
    remarkHeadingId,
    remarkDirective,
    remarkAdmonition,
    remarkBreaks,
    [remarkMath, { singleDollarTextMath: false }],
    // [remarkExtendedTable, { colspanWithEmpty: true }],
    remarkMentions,
    remarkInlineCssColor,
    remarkEmoji,
    [remarkEmbed, { size: [400, 225], componentNames: [["YouTube", "YouTubeEmbed"]] }],
    [remarkGitHub, { repo: config?.gitHubRepo }],
  ];
}

export interface RehypeConfiguration {}
export function configureRehypePlugins(config?: RehypeConfiguration): PluggableList {
  return [rehypeOverrideJsx, rehypeCodeMeta, [rehypeKatex, { throwOnError: false, errorColor: "#FF0000" }]];
}
