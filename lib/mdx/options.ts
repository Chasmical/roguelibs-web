import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-custom-heading-id";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import remarkExtendedTable from "remark-extended-table";
import rehypeKatex from "rehype-katex";
import remarkEmoji from "@lib/mdx/remark-emoji";
import remarkAdmonition from "@lib/mdx/remark-admonition";
import remarkEmbed from "@lib/mdx/remark-embed";
import rehypeCodeMeta from "@lib/mdx/rehype-code-meta";
import rehypeOverrideJsx from "@lib/mdx/rehype-override-jsx";
import remarkMentions from "@lib/mdx/remark-mentions";
import remarkInlineHexColor from "@lib/mdx/remark-inline-hex-color";
import remarkGitHub from "@lib/mdx/remark-github";

// TODO: newer versions of MDX plugins are available, but the latest version of next-mdx-remote doesn't work with them at the moment.

export const RemarkPlugins: PluggableList = [
  remarkGfm,
  remarkHeadingId,
  remarkDirective,
  remarkAdmonition,
  remarkBreaks,
  [remarkMath, { singleDollarTextMath: false }],
  [remarkExtendedTable, { colspanWithEmpty: true }],
  remarkMentions,
  remarkInlineHexColor,
  remarkEmoji,
  [remarkEmbed, { size: [400, 225], componentNames: [["YouTube", "YouTubeEmbed"]] }],
  remarkGitHub,
];

export const RehypePlugins: PluggableList = [rehypeOverrideJsx, rehypeCodeMeta, rehypeKatex];
