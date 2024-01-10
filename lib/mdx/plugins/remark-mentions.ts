import type { Transformer } from "unified";
import { findAndReplace } from "mdast-util-find-and-replace";

export interface RemarkMentionsOptions {
  buildUrl?: (username: string) => string;
  // TODO: maybe use a JSX component instead of a regular link
}

const MentionRegex = /@([0-9a-zA-Z][-0-9a-zA-Z_]*)/g;

export default function remarkMentions(options?: RemarkMentionsOptions): Transformer {
  const buildUrl = options?.buildUrl ?? (username => "/user/" + username);

  return (tree: any) => {
    findAndReplace(tree, [
      MentionRegex,
      (match, username) => {
        return {
          type: "link",
          url: buildUrl(username),
          children: [{ type: "strong", children: [{ type: "text", value: match }] }],
        };
      },
    ]);
  };
}
