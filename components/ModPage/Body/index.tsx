"use client";
import { useState } from "react";
import { ModPageContext } from "@components/ModPage";
import MdxPreview from "@components/Specialized/MdxPreview";
import TextArea from "@components/Common/TextArea";
import styles from "./index.module.scss";

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

export function ModPageDescription({ mod, original, mutateMod, rscDescription, mode }: ModPageBodyProps) {
  const [rscSource] = useState(original.description);

  return (
    <>
      {mode === "edit" ? (
        <>
          <label>{"Description"}</label>
          <TextArea
            className="markdown"
            value={mod.description}
            height="300px"
            autoTrimEnd={false}
            onChange={v => mutateMod(m => void (m.description = v))}
          />
        </>
      ) : mod.description === rscSource ? (
        <div className="markdown">{rscDescription}</div>
      ) : (
        <MdxPreview source={mod.description} />
      )}
    </>
  );
}
