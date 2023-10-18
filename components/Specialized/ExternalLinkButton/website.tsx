import NextLink from "next/link";
import styles from "./index.module.scss";
import Icon, { IconType } from "@components/Common/Icon";

export interface WebsiteLinkButtonProps {
  icon?: IconType | React.ReactNode;
  href?: string;
  label?: React.ReactNode;
}
export default function WebsiteLinkButton({ icon, href, label }: WebsiteLinkButtonProps) {
  if (!icon || typeof icon === "string") {
    icon = <Icon type={(icon as IconType) ?? "website"} />;
  }

  return (
    <div className={styles.button}>
      <NextLink href={href!}>{icon}</NextLink>
      <NextLink href={href!} className={styles.link}>
        {label ?? "Website"}
      </NextLink>
    </div>
  );
}
