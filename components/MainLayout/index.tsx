import Link from "@components/Common/Link";
import styles from "./index.module.scss";
import clsx from "clsx";
import AccountPanel from "@components/MainLayout/AccountPanel";

export interface MainLayoutProps {
  className?: string;
  children?: React.ReactNode;
  // ...props
  style?: React.CSSProperties;
}

export default function MainLayout({ className, children, ...props }: MainLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/" underline={false} className={styles.logo}>
          <img src="/logo-long.png" alt="RogueLibs' logo" />
        </Link>
        <AccountPanel />
      </div>
      <div className={clsx(styles.body, className)} {...props}>
        {children}
      </div>
      <div className={styles.footer}>
        <div>
          <label>{"Other stuff"}</label>
          {/* <Link href="/about">{"About RogueLibs"}</Link> */}
          <Link href="https://github.com/SugarBarrel/roguelibs-web">{"The source code"}</Link>
        </div>
        <div>
          <label>{"Guides and Information"}</label>
          <Link href="https://sugarbarrel.github.io/RogueLibs/docs/user/installation">{"Installing mods"}</Link>
          <Link href="https://sugarbarrel.github.io/RogueLibs/docs/dev/getting-started">{"Making mods"}</Link>
          <br />
          <Link href="https://sugarbarrel.github.io/SoRModHub">{"Old SoR ModHub"}</Link>
        </div>
        <div>
          <label>{"Streets of Rogue"}</label>
          <Link href="https://discord.com/invite/streetsofrogue">{"SoR on Discord"}</Link>
          <Link href="https://store.steampowered.com/app/512900">{"SoR on Steam"}</Link>
          <Link href="https://gamebanana.com/games/8455">{"SoR on GameBanana"}</Link>
          <Link href="https://streetsofrogue.fandom.com">{"SoR wiki"}</Link>
          <Link href="https://streetsofrogue.com">{"SoR website"}</Link>
        </div>
      </div>
    </div>
  );
}
