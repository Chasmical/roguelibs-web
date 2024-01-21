import { useId } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface SpriteProps {
  src: string;
  color?: string;
  width?: number;
  height?: number;
  size?: number;
  crisp?: boolean;
  alpha?: number;
  className?: string;
  style?: React.CSSProperties;
  dir8?: Dir8;
}

const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
type Dir8 = (typeof directions)[number];

export default function Sprite({
  src,
  width,
  height,
  size,
  color,
  crisp,
  alpha,
  className,
  style,
  dir8,
  ...props
}: SpriteProps) {
  width ??= size;
  height ??= size;

  const filterId = useId().replaceAll(":", "");

  let image: React.ReactNode;
  if (dir8) {
    const index = directions.indexOf(dir8);
    const ox = index >= 5 ? "0%" : index >= 1 && index <= 3 ? "-200%" : "-100%";
    const oy = index <= 1 || index === 7 ? "0%" : index >= 3 && index <= 5 ? "-200%" : "-100%";

    image = (
      <div
        className={clsx(styles.sprite, crisp && styles.crisp, className)}
        style={{
          opacity: alpha,
          filter: color ? `url(#${filterId})` : undefined,
          width,
          height,
          backgroundImage: `url("${src}")`,
          backgroundSize: "300% 300%",
          backgroundPositionX: ox,
          backgroundPositionY: oy,
          ...style,
        }}
        draggable="false"
        {...props}
      />
    );
  } else {
    image = (
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        className={clsx(styles.sprite, crisp && styles.crisp, className)}
        style={{ opacity: alpha, filter: color ? `url(#${filterId})` : undefined, ...style }}
        draggable="false"
        {...props}
      />
    );
  }

  return (
    <>
      {image}
      {color && (
        <svg className={styles.filterSvg} xmlns="http://www.w3.org/2000/svg">
          <filter id={filterId}>
            <feFlood result="flood" x="0" y="0" width="100%" height="100%" floodColor={color} />
            <feComposite in="flood" in2="SourceGraphic" operator="arithmetic" k1="1" />
          </filter>
        </svg>
      )}
    </>
  );
}
