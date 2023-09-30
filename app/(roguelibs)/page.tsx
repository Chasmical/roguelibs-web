"use client";
import styles from "./page.module.scss";
import Link from "@components/Common/Link";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div>{"RogueLibs Web is working!"}</div>
      <Link href="/mods/RogueLibs">{"Go to RogueLibs' mod page"}</Link>
      <Link href="/docs/user-guide/installation">{"Go to the installation guide"}</Link>
      <Link href="/docs/getting-started/installation">{"Go to the developer documentation"}</Link>
    </div>
  );
}
