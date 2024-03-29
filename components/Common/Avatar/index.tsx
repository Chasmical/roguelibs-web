import Link from "@components/Common/Link";
import styles from "./index.module.scss";
import { selectWithUid } from "@lib/utils/misc";

export interface AvatarProps extends Omit<React.HTMLProps<HTMLDivElement>, "size" | "src"> {
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
  style,
  ...props
}: React.PropsWithChildren<AvatarProps>) {
  size ??= 64;

  src ??= undefined;
  if (!src && uid != null) {
    src = selectUniqueAvatar(uid);
  }

  const avatar = (
    <div className={styles.wrapper} style={{ width: size, height: size, ...style }} {...props}>
      <svg className={styles.avatar} width={size} height={size}>
        <image href={src} width="100%" height="100%" />
      </svg>
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

const uniqueAvatarPaths = [
  "/logo-char1.png",
  "/logo-char2.png",
  "/keyart-char1.png",
  "/keyart-char2.png",
  "/keyart-char3.png",
];

export function selectUniqueAvatar(uid: string | number) {
  return selectWithUid(uid, uniqueAvatarPaths);
}
