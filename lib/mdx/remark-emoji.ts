import type { Transformer } from "unified";
import { findAndReplace } from "mdast-util-find-and-replace";
import type { PhrasingContent } from "mdast";
import { get as getEmoji } from "node-emoji";
import { toCodePoints } from "twemoji-parser";
import twemojiRegex from "twemoji-parser/dist/lib/regex"; // see ./twemoji-parser.d.ts
import { gemoji } from "gemoji";

// Code adapted and repurposed from the following plugins:
// - https://github.com/rhysd/remark-emoji
// - https://github.com/twitter/twemoji-parser
// - https://github.com/florianeckerstorfer/remark-a11y-emoji

const EmojiNameRegex = /:\+1:|:-1:|:[\w-]+:/g;

const EmojiRegex = new RegExp(`(\\\\*)(${twemojiRegex.source})`, "g");

export interface RemarkEmojiOptions {
  className?: string;
  base?: string;
  size?: string | number;
  ext?: string;
}

export default function remarkEmoji(options?: RemarkEmojiOptions): Transformer {
  options ??= {};

  const className = options.className ?? "emoji";
  const base = options.base ?? "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/";
  const size = (coerceSize(options.size) ?? "72x72") + "/";
  const ext = options.ext ?? ".png";

  return (tree: any) => {
    // replace emoji names with emojis
    findAndReplace(tree, EmojiNameRegex, emojiName => {
      return getEmoji(emojiName) ?? false;
    });
    // replace emojis with twemojis
    findAndReplace(tree, EmojiRegex, (_, escapes: string, emoji: string) => {
      const codepoint = toCodePoints(emoji).join("-");
      const src = base + size + codepoint + ext;
      const ariaLabel = getEmojiDescription(emoji);

      if (escapes.length % 2 === 1) {
        return escapes.slice(0, escapes.length / 2) + emoji;
      }

      const escapesContent: PhrasingContent = {
        type: "text",
        value: escapes.slice(0, escapes.length / 2),
      };
      const emojiContent: PhrasingContent = {
        type: "image",
        url: src,
        data: { hProperties: { draggable: "false", alt: emoji, className, ariaLabel } },
      };

      return [escapesContent, emojiContent];
    });
  };
}

function coerceSize(val: string | number | undefined) {
  return typeof val !== "number" ? val : val + "x" + val;
}

function findGemoji(emoji: string) {
  return gemoji.find(item => item.emoji === emoji);
}
function getEmojiDescription(emoji: string) {
  const skintone = emoji.match(SkintoneRegex)?.[0] as keyof typeof SkintoneMap;
  if (skintone) emoji = emoji.replace(SkintoneRegex, "");

  // also try to find by a fully qualified name
  let info = findGemoji(emoji) ?? findGemoji(emoji + "\uFE0F");
  if (!info) return "";

  const skintoneDescription = SkintoneMap[skintone];
  return skintoneDescription ? `${info.description} (${skintoneDescription})` : info.description;
}

const SkintoneMap = {
  "\uD83C\uDFFB": "skin tone 2",
  "\uD83C\uDFFC": "skin tone 3",
  "\uD83C\uDFFD": "skin tone 4",
  "\uD83C\uDFFE": "skin tone 5",
  "\uD83C\uDFFF": "skin tone 6",
  undefined: "",
};
const SkintoneRegex = new RegExp(Object.keys(SkintoneMap).join("|"), "g");
