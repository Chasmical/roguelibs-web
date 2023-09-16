import type { Transformer } from "unified";
import { findAndReplace } from "mdast-util-find-and-replace";
import type { PhrasingContent } from "mdast";
import { get as getEmoji } from "node-emoji";
import twemoji from "twemoji";
import { gemoji } from "gemoji";

// Code adapted and repurposed from the following plugins:
// - https://github.com/rhysd/remark-emoji
// - https://github.com/madiodio/remark-twemoji
// - https://github.com/florianeckerstorfer/remark-a11y-emoji

const EmojiNameRegex = /:\+1:|:-1:|:[\w-]+:/g;

const EmojiRegex = new RegExp(
  "(\\\\*)([\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])",
);

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
      const codepoint = twemoji.convert.toCodePoint(emoji);
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
