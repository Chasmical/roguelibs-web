import { RestMod } from "@lib/API";
import styles from "./index.module.scss";
import Link from "@components/Common/Link";
import Icon from "@components/Common/Icon";
import useImmerState from "@lib/hooks/useImmerState";
import NuggetButton from "@components/Specialized/NuggetButton";
import SubscriptionButton from "@components/Specialized/SubscriptionButton";

export interface ModCardProps {
  mod: RestMod;
}

export default function ModCard({ mod: initial }: ModCardProps) {
  const [mod, mutateMod] = useImmerState(initial);
  const modLink = mod ? `/mods/${mod.slug ?? mod.id}` : undefined;

  return (
    <div className={styles.container}>
      <Link href={modLink} tabIndex={-1} draggable="false">
        <div className={styles.window}>
          <img
            className={styles.banner}
            src={mod.card_banner_url ?? mod.banner_url ?? "/placeholder-10.png"}
            draggable="false"
            alt=""
          />
          <div className={styles.description}>{mod.card_description ?? mod.description}</div>
          <div className={styles.quickbar}>
            <NuggetButton className={styles.quickbarButton} mod={mod} mutateMod={mutateMod} iconSize={16} />
            <SubscriptionButton className={styles.quickbarButton} mod={mod} mutateMod={mutateMod} iconSize={16} />
          </div>
        </div>
      </Link>
      <div className={styles.details}>
        <div className={styles.title}>
          <Link href={modLink}>{mod.title}</Link>
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <Icon type="nugget" size={16} />
          {mod.nugget_count}
        </div>
      </div>
    </div>
  );
}
