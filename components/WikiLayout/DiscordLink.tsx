"use client";
import Link, { LinkProps } from "@components/Common/Link";
import { useLayoutEffect, useState } from "react";

export interface DiscordLinkProps extends Omit<LinkProps, "href"> {}

export default function DiscordLink(props: DiscordLinkProps) {
  const discordLink = useDiscordLink();
  return <Link {...props} href={discordLink} />;
}

export function useDiscordLink() {
  let [link, setLink] = useState("https://discord.com/invite/streetsofrogue");

  useLayoutEffect(() => {
    const preferred = navigator.languages.slice(0, 2);
    if (preferred.some(lang => lang.startsWith("ru"))) {
      setLink("https://discord.gg/neDvsmk");
    }
  }, []);

  return link;
}
