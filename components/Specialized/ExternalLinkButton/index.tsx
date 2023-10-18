import GitHubButton, { GitHubButtonProps } from "./github";
import GameBananaButton, { GameBananaButtonProps } from "./gamebanana";
import WebsiteLinkButton, { WebsiteLinkButtonProps } from "./website";

export interface ExternalLinkButtonProps {
  type: "github" | "gamebanana";
}

export default function ExternalLinkButton({ type, ...props }: ExternalLinkButtonProps) {
  switch (type) {
    case "github":
      return <GitHubButton {...(props as GitHubButtonProps)} />;
    case "gamebanana":
      return <GameBananaButton {...(props as GameBananaButtonProps)} />;
    default:
      return <WebsiteLinkButton {...(props as WebsiteLinkButtonProps)} />;
  }
}
