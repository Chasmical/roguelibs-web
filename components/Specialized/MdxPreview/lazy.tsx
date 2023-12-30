import { MdxOptions, compileMdx } from "@lib/mdx";
import configureComponents, { ComponentsConfig } from "@lib/mdx/components";
import configurePlugins, { RehypeConfiguration, RemarkConfiguration } from "@lib/mdx/plugins";
import { useEffect, useState, useMemo } from "react";

export interface MdxRendererProps {
  source: string;
  config: RemarkConfiguration & RehypeConfiguration & ComponentsConfig;
}
export default function MdxRenderer({ source, config }: MdxRendererProps) {
  const options = useMemo<MdxOptions>(() => {
    return {
      ...configurePlugins(config),
      components: configureComponents(config),
    };
  }, []);

  const [content, setContent] = useState<React.ReactNode>(() => <>{"Rendering MDX..."}</>);

  useEffect(() => {
    compileMdx(source, options).then(data => setContent(data.content));
  }, [source, options]);

  return content;
}
