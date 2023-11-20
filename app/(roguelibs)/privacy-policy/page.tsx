import clsx from "clsx";
import styles from "./page.module.scss";
import { compileMDX } from "@lib/mdx";
import SetCanonicalUrl from "@components/Specialized/SetCanonicalUrl";

export default async function PrivacyPolicyPage() {
  const source = `

  # Privacy Policy

  `;

  const { content } = await compileMDX(source);

  return (
    <div className={clsx(styles.container, "markdown")}>
      {content}
      <SetCanonicalUrl url="/privacy-policy" />
    </div>
  );
}
