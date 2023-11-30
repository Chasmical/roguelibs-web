import NextLink from "next/link";
import styles from "./index.module.scss";
import Icon from "@components/Common/Icon";

export interface GameBananaButtonProps {
  id: number;
}
export default function GameBananaButton({ id }: GameBananaButtonProps) {
  const modHref = `https://gamebanana.com/mods/${id}`;

  return (
    <div className={styles.button}>
      <NextLink href={modHref} tabIndex={-1}>
        <Icon type="gamebanana" />
      </NextLink>
      <NextLink className={styles.link} href={modHref} target="_blank">
        {"GameBanana Page"}
      </NextLink>
    </div>
  );
}
