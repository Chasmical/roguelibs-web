"use client";
import Button, { ButtonProps } from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import Tooltip from "@components/Common/Tooltip";
import { useApi } from "@lib/hooks";
import { arrayToggle } from "@lib/utils/misc";
import { useEffect, useId, useState } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface NuggetButtonProps extends Omit<ButtonProps, "onClick" | "onChange"> {
  value: number;
  mod_id: number;
  onChange?: (newValue: number) => void;
  iconSize?: number;
}

export default function NuggetButton({
  value: nuggetCount,
  mod_id,
  onChange,
  className,
  iconSize,
  ["data-tooltip-id"]: providedTooltipId,
  ...props
}: NuggetButtonProps) {
  const api = useApi();
  const ownTooltipId = useId();
  const tooltipId = providedTooltipId ?? ownTooltipId;

  const [loading, setLoading] = useState(false);
  const [nuggetted, setNuggetted] = useState(api.currentUser?.mod_nuggets.includes(mod_id));

  useEffect(() => {
    setNuggetted(api.currentUser?.mod_nuggets.includes(mod_id));
  }, [api.currentUser]);

  async function toggleNugget() {
    if (loading || !api.currentUser) return;
    setLoading(true);
    try {
      const newNuggetCount = await api.setModNugget(mod_id, !nuggetted);
      onChange?.(newNuggetCount);
      arrayToggle(api.currentUser!, "mod_nuggets", mod_id, !nuggetted);
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
      data-tooltip-content="You must sign in to rate mods!"
      className={clsx(styles.button, nuggetted && styles.set, className)}
      onClick={e => (e.preventDefault(), e.stopPropagation(), toggleNugget())}
      {...props}
    >
      <Icon type={loading ? "loading" : "nugget"} alpha={loading || nuggetted ? 1 : 0.5} size={iconSize} />
      {nuggetCount}
      {!api.currentUser && !providedTooltipId && (
        <Tooltip id={tooltipId} place="top" openOnClick variant="error" content="" delayHide={-1} />
      )}
    </Button>
  );
}
