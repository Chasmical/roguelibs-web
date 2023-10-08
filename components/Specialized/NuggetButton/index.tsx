"use client";
import Button, { ButtonProps } from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import Tooltip from "@components/Common/Tooltip";
import { DbMod } from "@lib/Database";
import { useApi } from "@lib/hooks";
import { ImmerStateSetter } from "@lib/hooks/useImmerState";
import { arrayToggle } from "@lib/utils/misc";
import { useEffect, useId, useMemo, useState } from "react";
import { RestMod } from "@lib/API";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface NuggetButtonProps extends Omit<ButtonProps, "onClick"> {
  mod: DbMod;
  mutateMod?: ImmerStateSetter<RestMod>;
  iconSize?: number;
}

export default function NuggetButton({ mod, mutateMod, className, iconSize, ...props }: NuggetButtonProps) {
  const api = useApi();
  const tooltipId = useId();

  const [loading, setLoading] = useState(false);
  const [nuggetted, setNuggetted] = useState(api.currentUser?.mod_nuggets.includes(mod.id));

  const [nuggetCount, setNuggetCount] = useState<number | null>(null);
  useMemo(() => setNuggetCount(mod.nugget_count), [mod]);

  useEffect(() => {
    setNuggetted(api.currentUser?.mod_nuggets.includes(mod.id));
  }, [api.currentUser]);

  async function toggleNugget() {
    if (loading || !api.currentUser) return;
    setLoading(true);
    try {
      const newNuggetCount = await api.setModNugget(mod.id, !nuggetted);
      mutateMod ? mutateMod(m => void (m.nugget_count = newNuggetCount)) : setNuggetCount(newNuggetCount);
      arrayToggle(api.currentUser!, "mod_nuggets", mod.id, !nuggetted);
      setNuggetted(!nuggetted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      data-tooltip-id={tooltipId}
      className={clsx(styles.button, nuggetted && styles.set, className)}
      onClick={e => (e.preventDefault(), e.stopPropagation(), toggleNugget())}
      {...props}
    >
      <Icon type={loading ? "loading" : "nugget"} alpha={loading || nuggetted ? 1 : 0.5} size={iconSize} />
      {nuggetCount}
      {!api.currentUser && (
        <Tooltip id={tooltipId} place="top" openOnClick variant="error" content="You mush sign in to rate mods!" />
      )}
    </Button>
  );
}
