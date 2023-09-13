import Link from "@components/Common/Link";
import styles from "./index.module.scss";
import { HTMLProps } from "react";

export interface AvatarProps extends Omit<HTMLProps<HTMLDivElement>, "size" | "src"> {
  src: string | null | undefined;
  uid?: string | number;
  size?: string | number;
  href?: string;
  blank?: boolean;
}

export default function Avatar({
  src,
  uid,
  size,
  href,
  blank,
  children,
  ...props
}: React.PropsWithChildren<AvatarProps>) {
  size ??= 64;

  src ??= undefined;
  if (!src && uid) {
    // TODO: get default pre-generated avatar
  }

  const avatar = (
    <div className={styles.wrapper} style={{ width: size }} {...props}>
      <img className={styles.avatar} src={src} width={size} alt="" />
      {children && <div className={styles.overlay}>{children}</div>}
      {(!!children || href || props.onClick) && <div className={styles.overlayBackdrop} />}
    </div>
  );

  return href ? (
    <Link href={href} blank={blank} className={styles.linkWrapper} style={{ width: size }} underline={false}>
      {avatar}
    </Link>
  ) : (
    avatar
  );
}
