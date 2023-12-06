import type { Transformer } from "unified";
import { findAndReplace } from "mdast-util-find-and-replace";

export interface RemarkGitHubOptions {
  repo: string | null | undefined;
}

const CommitShaRegex = /\b([0-9a-f]{40})\b/g;

export default function remarkGitHub(options?: RemarkGitHubOptions): Transformer {
  const repo = options?.repo;
  if (!repo) return () => {};

  return (tree: any) => {
    findAndReplace(tree, [
      CommitShaRegex,
      (match: string, sha: string) => {
        return {
          type: "link",
          url: `https://github.com/${repo}/commit/${sha}`,
          children: [{ type: "strong", children: [{ type: "inlineCode", value: sha.slice(0, 7) }] }],
        };
      },
    ]);
  };
}
