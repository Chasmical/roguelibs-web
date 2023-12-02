import styles from "./index.module.scss";
import Button from "@components/Common/Button";
import Icon from "@components/Common/Icon";
import clsx from "clsx";
import { useState } from "react";
import { RestMod } from "@lib/API";
import { diff } from "@lib/utils/diff";
import { selectHasChanges, useModPage, useModPageDispatch, useModPageStore } from "../redux";

export default function ModPageEditorOverlay() {
  const store = useModPageStore();
  const dispatch = useModPageDispatch();

  const [saving, setSaving] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const mode = useModPage(s => s.mode);
  const hasChanges = useModPage(selectHasChanges);
  const changes: string[] = [];

  const stageIndex = saving ? 3 : mode === "edit" ? 1 : mode === "preview" ? 2 : 0;

  function onCancel() {
    if (hasChanges) {
      dispatch(s => ((s.mod = s.original), (s.mode = "edit")));
    } else {
      dispatch(s => (s.mode = null));
    }
  }
  function onEdit() {
    if (mode === "edit") return;
    dispatch(s => (s.mode = "edit"));
  }
  async function onPreview() {
    if (mode === "preview") return;
    try {
      setLoadingPreview(true);
      dispatch(s => (s.mode = "preview"));
      await new Promise(r => setTimeout(r, 1000));
    } finally {
      setLoadingPreview(false);
    }
  }
  async function onSave() {
    if (!hasChanges) return;
    try {
      setSaving(true);
      const original = store.getState().original;
      const mod = store.getState().mod;

      const changes = diff(original, mod, {
        nugget_count: false,
        subscription_count: false,
        authors: { user: false },
      });

      const response = await fetch(`${location.origin}/api/update_mod`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mod.id, ...changes }),
      });
      if (!response.ok) throw new Error(await response.text());
      const newMod = (await response.json()) as RestMod;

      dispatch(s => {
        s.mode = null;
        s.original = newMod;
        s.mod = newMod;
      });
    } finally {
      setSaving(false);
    }
  }

  if (!hasChanges && !mode) return;

  function stageButtonStyle(index: number, ready?: boolean) {
    return clsx(
      styles.stageButton,
      index < stageIndex && styles.previous,
      index === stageIndex && styles.current,
      index === stageIndex + 1 && styles.next,
      (ready ?? true) && styles.ready,
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.changesList} style={{ ["--changes-count" as string]: changes.length }}>
        <label>{"Changes:"}</label>
        <ul>
          {changes.map(c => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <div className={styles.changesListBorder} />
        <div className={styles.changesListBorderMask} />
      </div>
      <div className={styles.stageButtons}>
        <div className={clsx(styles.stageButton, styles.cancelButton)}>
          <Button onClick={onCancel} disabled={saving || loadingPreview}>
            <Icon type="cross" />
            {hasChanges ? "Reset" : "Cancel"}
          </Button>
        </div>
        <div className={stageButtonStyle(1)}>
          <Button onClick={onEdit} disabled={saving || loadingPreview}>
            <Icon type="edit" />
            {"Edit"}
            <div />
          </Button>
        </div>
        <div className={clsx(styles.stageLine, stageIndex >= 1 && hasChanges && styles.active)} />
        <div className={stageButtonStyle(2, hasChanges)}>
          <Button onClick={onPreview} disabled={saving || !hasChanges}>
            <Icon type={loadingPreview ? "loading" : "visibility"} />
            {"Preview"}
          </Button>
        </div>
        <div className={clsx(styles.stageLine, stageIndex >= 2 && !loadingPreview && styles.active)} />
        <div className={stageButtonStyle(3, stageIndex === 2 && !loadingPreview)}>
          <Button onClick={onSave} disabled={stageIndex < 2 || loadingPreview}>
            <Icon type={saving ? "loading" : "save"} />
            {"Commit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
