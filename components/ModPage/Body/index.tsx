"use client";
import { ModPageContext } from "@components/ModPage";
import MdxPreview from "@components/Specialized/MdxPreview";
import TextArea from "@components/Common/TextArea";
import styles from "./index.module.scss";
import { useState } from "react";

export interface ModPageBodyProps extends ModPageContext {
  rscDescription: React.ReactNode;
}
export default function ModPageBody(props: ModPageBodyProps) {
  return (
    <div className={styles.wrapper}>
      <ModPageDescription {...props} />
    </div>
  );
}

export function ModPageDescription({ mod, original, mutateMod, rscDescription, isEditing }: ModPageBodyProps) {
  const [rscSource] = useState(original.description);

  return (
    <div>
      {isEditing ? (
        <TextArea value={mod.description} onChange={v => mutateMod(m => void (m.description = v))} />
      ) : mod.description === rscSource ? (
        <div className="markdown">{rscDescription}</div>
      ) : (
        <MdxPreview source={mod.description} />
      )}
    </div>
  );
}
