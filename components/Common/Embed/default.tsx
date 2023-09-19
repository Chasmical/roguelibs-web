import { HTMLAttributes, useMemo } from "react";
import { oEmbedResponse } from "@lib/mdx/remark-embed";
import styles from "./index.module.scss";
import clsx from "clsx";
import Link from "@components/Common/Link";

export interface DefaultEmbedProps extends HTMLAttributes<HTMLElement> {
  url: string;
  data: oEmbedResponse | string;
  className?: string;
  style?: React.CSSProperties;
  // ...props
}

export default function DefaultEmbed({ url, data, ...props }: DefaultEmbedProps) {
  const embed = useMemo<oEmbedResponse>(() => (typeof data === "string" ? JSON.parse(data) : data), [data]);

  props.className = clsx(styles.embed, props.className);
  props.style = { ...props.style, width: embed.width, height: embed.height };

  switch (embed.type) {
    case "video":
    case "rich":
      return <div role="panel" {...props} dangerouslySetInnerHTML={{ __html: embed.html }} />;
    case "link":
      return (
        <div role="panel" {...props}>
          <Link href={url}>{embed.title}</Link>
        </div>
      );
    case "photo":
      return (
        <div role="panel" {...props}>
          <img src={embed.url} alt={embed.title} title={embed.title} />
        </div>
      );
  }
}
