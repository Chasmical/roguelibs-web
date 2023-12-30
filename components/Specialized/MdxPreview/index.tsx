"use client";
import { Suspense, lazy } from "react";
import type { MdxRendererProps } from "./lazy";
import styles from "./index.module.scss";
import clsx from "clsx";

const MdxRenderer = lazy(() => import("./lazy"));

export interface MdxPreviewProps extends React.HTMLProps<HTMLDivElement> {
  source: string;
  config: MdxRendererProps["config"];
  className?: string;
  // ...props
  style?: React.CSSProperties;
}
export default function MdxPreview({ source, config, className, ...props }: MdxPreviewProps) {
  return (
    <div className={clsx(styles.wrapper, "markdown", className)} {...props}>
      <Suspense fallback={<>{"Loading MDX renderer..."}</>}>
        <MdxRenderer source={source} config={config} />
      </Suspense>
    </div>
  );
}
