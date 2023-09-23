import type { Transformer } from "unified";
import { findAndReplace } from "mdast-util-find-and-replace";

export interface RemarkMentionsOptions {}

const MentionRegex = /@([0-9a-zA-Z][-0-9a-zA-Z_]*)/g;

export default function remarkMentions(options?: RemarkMentionsOptions): Transformer {
  return (tree: any) => {
    findAndReplace(tree, MentionRegex, (match, username) => {
      return {
        type: "link",
        url: `/users/` + username,
        children: [{ type: "strong", children: [{ type: "text", value: match }] }],
      };
    });
  };
}
