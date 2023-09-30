"use client";
import { useState } from "react";
import { ModPageContext } from "@components/ModPage";
import Button from "@components/Common/Button";
import MdxPreview from "@components/Specialized/MdxPreview";
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

export function ModPageDescription({ mod, original, mutateMod, rscDescription }: ModPageBodyProps) {
  const [loading, setLoading] = useState(false);

  function toggleDescription() {
    if (loading) return;
    setLoading(true);
    mutateMod(m => {
      m.description = `
# RogueLibs

The most *important* **modding** \`library\` in the [Streets of Rogue](https://discord.gg/streetsofrogue) community. :tada:

## **Dope** *new* description, :grin:
`;
      return void 0;
    });
  }

  return (
    <div>
      <Button onClick={toggleDescription} disabled={loading}>
        {"Toggle"}
      </Button>
      <div>{loading ? "Loading..." : ""}</div>
      {mod.description === original.description ? (
        <div className="markdown">{rscDescription}</div>
      ) : (
        <MdxPreview source={mod.description} onLoad={() => setLoading(false)} />
      )}
    </div>
  );
}
