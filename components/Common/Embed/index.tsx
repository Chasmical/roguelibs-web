import { useMemo } from "react";
import { oEmbedResponse } from "@lib/mdx/plugins/remark-embed";
import YouTubeEmbed from "./youtube";
import DefaultEmbed from "./default";

export interface EmbedProps extends React.HTMLAttributes<HTMLElement> {
  data: oEmbedResponse | string;
  // ...props
  url: string;
}

export default function Embed({ data, ...props }: EmbedProps) {
  const embed = useMemo<oEmbedResponse>(() => (typeof data === "string" ? JSON.parse(data) : data), [data]);

  if (embed.provider_name === "YouTube" && embed.type === "video") {
    return <YouTubeEmbed data={embed} {...props} />;
  } else {
    return <DefaultEmbed data={embed} {...props} />;
  }
}
