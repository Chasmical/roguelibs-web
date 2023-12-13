"use client";
import { useEffect, useState } from "react";
import MdxPreview from "@components/Specialized/MdxPreview";
import TextArea from "@components/Common/TextArea";
import styles from "./index.module.scss";
import Button from "@components/Common/Button";
import Icon, { IconType } from "@components/Common/Icon";
import TextInput from "@components/Common/TextInput";
import Tabs from "@components/Common/Tabs";
import TabItem from "@components/Common/TabItem";
import { useModPage, useModPageDispatch } from "../redux";
import ModPageReleases from "./ReleaseList";
import clsx from "clsx";

export interface ModPageBodyProps {
  rscSource: string;
  rscDescription: React.ReactNode;
  rscChangelogs: React.ReactNode[];
}
export default function ModPageBody(props: ModPageBodyProps) {
  const mode = useModPage(s => s.mode);

  return (
    <div className={styles.wrapper}>
      <Tabs className={styles.bodyTabs} query="tab" faded>
        <TabItem icon="copy" label="Description">
          <ModPageDescription {...props} />
        </TabItem>
        <TabItem icon="copy" label="Releases">
          <ModPageReleases rscChangelogs={props.rscChangelogs} />
        </TabItem>
        {mode === "edit" && (
          <>
            <TabItem icon="copy" label="Banner">
              <ModPageBanner />
            </TabItem>
          </>
        )}
      </Tabs>
    </div>
  );
}

function ModPageDescription({ rscSource, rscDescription }: ModPageBodyProps) {
  const dispatch = useModPageDispatch();
  const mode = useModPage(s => s.mode);
  const description = useModPage(s => s.mod.description);
  const is_verified = useModPage(s => s.mod.is_verified);

  if (mode !== "edit") {
    if (description === rscSource) {
      return <div className="markdown">{rscDescription}</div>;
    }
    return <MdxPreview source={description} is_verified={is_verified} />;
  }

  return (
    <TextArea
      className="markdown"
      value={description}
      minHeight="100%"
      style={{ height: "100%" }}
      autoTrimEnd={false}
      onChange={v => dispatch(s => (s.mod.description = v))}
      error={description => {
        if (description.length > 4000) return `Exceeded length limit (${description.length}/4000).`;
      }}
    />
  );
}

function ModPageBanner() {
  const dispatch = useModPageDispatch();
  const banner_url = useModPage(s => s.mod.banner_url);
  const banner_layout = useModPage(s => s.mod.banner_layout);

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  function onChange(value: string) {
    setFileUrl(null);
    dispatch(s => (s.mod.banner_url = value || null));
  }
  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    dispatch(s => (s.mod.banner_url = url || null));
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
              value={banner_url}
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
            className={clsx(banner_layout === num && styles.active)}
            onClick={() => dispatch(s => (s.mod.banner_layout = num))}
          >
            <Icon type={("align" + num) as IconType} />
          </Button>
        ))}
      </div>
    </div>
  );
}
