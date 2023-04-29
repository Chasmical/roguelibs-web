import { useId, useMemo } from "react";
import { SpriteProps } from ".";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface SvgSpriteProps extends SpriteProps {}

export default function SvgSprite({
  src,
  color,
  width,
  height,
  size,
  crisp,
  alpha,
  className,
  style,
  ...props
}: SvgSpriteProps) {
  if (width == null) width = size ?? 32;
  if (height == null) height = size ?? 32;
  if (color == null) color = "white";

  const id = useId();
  const filterStyle = useMemo(() => ({ filter: `url(#${id})` }), [id]);

  return (
    <svg
      className={clsx(styles.sprite, crisp && styles.crisp, className)}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      style={{ opacity: alpha, ...style }}
      {...props}
    >
      <defs>
        <filter id={id}>
          <feFlood result="flood" x="0" y="0" width="100%" height="100%" floodColor={color} floodOpacity="1" />
          <feComposite in="flood" in2="SourceGraphic" operator="arithmetic" k1="1" />
        </filter>
      </defs>

      <image xlinkHref={src} style={filterStyle} />
    </svg>
  );
}
