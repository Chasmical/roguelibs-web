import clsx from "clsx";
import styles from "./index.module.scss";
import { useMemo } from "react";

export interface LayoutImageProps {
  src: string | null;
  alt: string | null;
  width?: number | string;
  height: number | string;
  layout: ImageLayout;
  className?: string;
  style?: React.CSSProperties;
}

export default function LayoutImage({ src, alt, width, height, layout, className, style, ...props }: LayoutImageProps) {
  const layoutClass = imageLayouts[(layout || ImageLayout.HeightMiddle) - 1];
  style = useMemo(() => ({ width, height, ...style }), [width, height, style]);

  return (
    <div className={clsx(styles.wrapper, className)} style={style} {...props}>
      <img
        className={clsx(styles.image, layoutClass)}
        src={src || undefined}
        alt={alt || undefined}
        draggable="false"
      />
    </div>
  );
}

export enum ImageLayout {
  HeightLeft = 1,
  HeightMiddle = 2,
  HeightRight = 3,
  WidthTop = 4,
  WidthMiddle = 5,
  WidthBottom = 6,
  Stretch = 7,
}

export const imageLayouts = [
  /* 1 */ styles.l1,
  /* 2 */ styles.l2,
  /* 3 */ styles.l3,
  /* 4 */ styles.l4,
  /* 5 */ styles.l5,
  /* 6 */ styles.l6,
  /* 7 */ styles.l7,
] as const;
