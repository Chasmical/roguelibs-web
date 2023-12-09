import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { compileMdx } from "@lib/mdx";
import configurePlugins from "@lib/mdx/plugins";
import configureComponents from "@lib/mdx/components";
import styles from "./page.module.scss";
import clsx from "clsx";
import source from "!raw-loader!./content.mdx";

export default async function MarkdownFeaturesPage() {
  const { content } = await compileMdx(source as any, {
    format: "mdx",
    ...configurePlugins({ gitHubRepo: "SugarBarrel/RogueLibs" }),
    components: configureComponents(),
  });

  return (
    <div className={clsx(styles.container, "markdown")}>
      {content}
      <SetCanonicalUrl url="/markdown-features" />
    </div>
  );
}
