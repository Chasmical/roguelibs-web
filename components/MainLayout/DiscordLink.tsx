"use client";
import Link, { LinkProps } from "@components/Common/Link";
import { useEffect, useState } from "react";

export interface DiscordLinkProps extends Omit<LinkProps, "href"> {}

export default function DiscordLink({ children, ...props }: DiscordLinkProps) {
  const discordLink = useDiscordLink();

  return (
    <Link {...props} href={discordLink}>
      {children}
    </Link>
  );
}

function useDiscordLink() {
  let [link, setLink] = useState("https://discord.com/invite/streetsofrogue");

  useEffect(() => {
    const index = navigator?.languages.findIndex(lang => lang.startsWith("ru"));
    if (index != null && index >= 0 && index < 2) {
      setLink("https://discord.gg/neDvsmk");
    }
  });

  return link;
}
