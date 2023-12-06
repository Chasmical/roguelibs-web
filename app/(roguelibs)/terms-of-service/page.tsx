import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";
import { compileMdx } from "@lib/mdx";
import configurePlugins from "@lib/mdx/plugins";
import configureComponents from "@lib/mdx/components";
import styles from "./page.module.scss";
import clsx from "clsx";

export default async function TermsOfServicePage() {
  const source = `

  # Terms of Service

  `;

  const { content } = await compileMdx(source, {
    ...configurePlugins(),
    components: configureComponents(),
  });

  return (
    <div className={clsx(styles.container, "markdown")}>
      {content}
      <SetCanonicalUrl url="/terms-of-service" />
    </div>
  );
}
