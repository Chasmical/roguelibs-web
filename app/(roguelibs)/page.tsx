"use client";
import styles from "./page.module.scss";
import Link from "@components/Common/Link";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div>{"RogueLibs Web is working!"}</div>
      <Link href="/mods/RogueLibs">{"Go to RogueLibs' mod page"}</Link>
    </div>
  );
}
