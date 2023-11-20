"use client";
import { useState } from "react";
import { ModPageContext } from "@components/ModPage";
import MdxPreview from "@components/Specialized/MdxPreview";
import TextArea from "@components/Common/TextArea";
import styles from "./index.module.scss";
import Button from "@components/Common/Button";
import Icon, { IconType } from "@components/Common/Icon";
import clsx from "clsx";
import TextInput from "@components/Common/TextInput";

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

export function ModPageDescription(props: ModPageBodyProps) {
  const { mod, original, rscDescription, mode } = props;
  const [rscSource] = useState(original.description);

  return (
    <>
      {mode === "edit" ? (
        <ModPageEditControls {...props} />
      ) : mod.description === rscSource ? (
        <div className="markdown">{rscDescription}</div>
      ) : (
        <MdxPreview source={mod.description} />
      )}
    </>
  );
}

export function ModPageEditControls({ mod, mutateMod }: ModPageBodyProps) {
  return (
    <>
      <div className={styles.editBanner}>
        {/* <div>{"Upload image here"}</div> */}
        <div className={styles.bannerUrlInput}>
          <label>{"Banner"}</label>
          <TextInput
            value={mod.banner_url}
            placeholder={"/placeholder.png"}
            onChange={v => mutateMod(m => void (m.banner_url = v || null))}
            error={banner_url => {
              if (banner_url.length > 255) return `Exceeded length limit (${banner_url.length}/255).`;
            }}
          />
        </div>
        <div className={styles.bannerAlignmentGrid}>
          {[1, 2, 3, 4, 5, 6, 7].map(num => (
            <Button
              key={num}
              className={clsx(mod.banner_layout === num && styles.active)}
              onClick={() => mutateMod(m => void (m.banner_layout = num))}
            >
              <Icon type={("align" + num) as IconType} />
            </Button>
          ))}
        </div>
      </div>
      <label>{"Description"}</label>
      <TextArea
        className="markdown"
        value={mod.description}
        height="300px"
        autoTrimEnd={false}
        onChange={v => mutateMod(m => void (m.description = v))}
        error={description => {
          if (description.length > 4000) return `Exceeded length limit (${description.length}/4000).`;
        }}
      />
    </>
  );
}
