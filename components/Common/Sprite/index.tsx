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
}

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
  ...props
}: SpriteProps) {
  width ??= size;
  height ??= size;

  const filterId = useId().replaceAll(":", "");

  const image = (
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
