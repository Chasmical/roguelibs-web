import Admonition from "@components/Common/Admonition";
import Code from "@components/Common/Code";
import CodeBlock from "@components/Common/CodeBlock";
import Embed from "@components/Common/Embed";
import YouTubeEmbed from "@components/Common/Embed/youtube";
import Link from "@components/Common/Link";
import type { MDXComponents } from "mdx/types";

const MdxComponents: MDXComponents = {
  code: Code,
  pre: CodeBlock,
  a: Link as never,
  Admonition: Admonition,
  Embed: Embed,
  YouTubeEmbed: YouTubeEmbed,
};
export default MdxComponents;
