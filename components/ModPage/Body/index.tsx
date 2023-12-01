"use client";
import { useEffect, useState } from "react";
import { ModPageContext } from "@components/ModPage";
import MdxPreview from "@components/Specialized/MdxPreview";
import TextArea from "@components/Common/TextArea";
import styles from "./index.module.scss";
import Button from "@components/Common/Button";
import Icon, { IconType } from "@components/Common/Icon";
import clsx from "clsx";
import TextInput from "@components/Common/TextInput";
import Tabs from "@components/Common/Tabs";
import TabItem from "@components/Common/TabItem";

export interface ModPageBodyProps extends ModPageContext {
  rscDescription: React.ReactNode;
}
export default function ModPageBody(props: ModPageBodyProps) {
  return (
    <div className={styles.wrapper}>
      <Tabs className={styles.bodyTabs} lazy faded>
        <TabItem icon="copy" label="Description">
          <ModPageDescription {...props} />
        </TabItem>
        <TabItem icon="copy" label="Releases">
          <ModPageReleases {...props} />
        </TabItem>
        {props.mode === "edit" && (
          <TabItem icon="copy" label="Banner">
            <ModPageBanner {...props} />
          </TabItem>
        )}
      </Tabs>
    </div>
  );
}

export function ModPageDescription(props: ModPageBodyProps) {
  const { mod, original, mutateMod, rscDescription, mode } = props;
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
            error={description => {
              if (description.length > 4000) return `Exceeded length limit (${description.length}/4000).`;
            }}
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

export function ModPageReleases(props: ModPageBodyProps) {
  return null;
}

export function ModPageBanner({ mod, mutateMod }: ModPageBodyProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  function onChange(value: string) {
    setFileUrl(null);
    mutateMod(m => void (m.banner_url = value || null));
  }
  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    mutateMod(m => void (m.banner_url = url));
  }

  useEffect(() => {
    return () => void (fileUrl && URL.revokeObjectURL(fileUrl));
  }, [fileUrl]);

  return (
    <div className={styles.editBanner}>
      <div className={styles.bannerUrlInput}>
        <label>{"Banner"}</label>
        <Tabs style={{ height: 150 }}>
          <TabItem label="External URL">
            <TextInput
              value={mod.banner_url}
              placeholder={"/placeholder.png"}
              onChange={onChange}
              error={banner_url => {
                if (banner_url.length > 255) return `Exceeded length limit (${banner_url.length}/255).`;
              }}
            />
          </TabItem>
          <TabItem label="Upload file">
            <input type="file" onChange={onUpload} />
          </TabItem>
        </Tabs>
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
  );
}
