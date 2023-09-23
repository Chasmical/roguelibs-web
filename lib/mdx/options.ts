import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-custom-heading-id";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import remarkExtendedTable from "remark-extended-table";
import remarkMentions from "remark-mentions/lib";
import rehypeKatex from "rehype-katex";
import remarkEmoji from "@lib/mdx/remark-emoji";
import remarkAdmonition from "@lib/mdx/remark-admonition";
import remarkEmbed from "@lib/mdx/remark-embed";
import rehypeCodeMeta from "@lib/mdx/rehype-code-meta";
import rehypeOverrideJsx from "@lib/mdx/rehype-override-jsx";

export const RemarkPlugins: PluggableList = [
  remarkGfm,
  remarkHeadingId,
  remarkDirective,
  remarkAdmonition,
  remarkBreaks,
  remarkMath,
  [remarkExtendedTable, { colspanWithEmpty: true }],
  [remarkMentions, { usernameLink: (username: string) => `/users/${username}` }], // TODO: rewrite this one as well
  remarkEmoji,
  [remarkEmbed, { size: [400, 225], componentNames: [["YouTube", "YouTubeEmbed"]] }],
];

export const RehypePlugins: PluggableList = [rehypeOverrideJsx, rehypeCodeMeta, rehypeKatex];
