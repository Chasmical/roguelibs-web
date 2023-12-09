import styles from "./index.module.scss";
import clsx from "clsx";

export interface BrowserWindowProps {
  address?: string;
  children: React.ReactNode;
  className?: string;
  // ...props
  style?: React.CSSProperties;
}

export default function BrowserWindow({ address: url, children, className }: BrowserWindowProps) {
  if (!url) {
    url = "https://roguelibs.com/";
  } else if (!url.includes("://")) {
    url = "https://roguelibs.com" + (url.startsWith("/") ? "" : "/") + url;
  }

  return (
    <div role="panel" className={clsx(styles.window, className)}>
      <div className={styles.header}>
        <div className={styles.dots}>
          <div className={styles.dot} style={{ backgroundColor: "#f25f58" }} />
          <div className={styles.dot} style={{ backgroundColor: "#fbbe3c" }} />
          <div className={styles.dot} style={{ backgroundColor: "#58cb42" }} />
        </div>
        <div className={styles.addressBar}>{url ?? "https://roguelibs.com/"}</div>
        <div className={styles.menuIcon}>
          <div className={styles.menuIconBar} />
          <div className={styles.menuIconBar} />
          <div className={styles.menuIconBar} />
        </div>
      </div>
      <div role="panel" className={styles.container}>
        {children}
      </div>
    </div>
  );
}
