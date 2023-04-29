"use client";
import { SpriteProps } from ".";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface ImgSpriteProps extends Omit<SpriteProps, "color"> {}

export default function ImgSprite({
  src,
  width,
  height,
  size,
  crisp,
  alpha,
  className,
  style,
  ...props
}: ImgSpriteProps) {
  if (width == null) width = size ?? 32;
  if (height == null) height = size ?? 32;

  return (
    <img
      src={src}
      alt=""
      width={width}
      height={height}
      className={clsx(styles.sprite, crisp && styles.crisp, className)}
      style={{ opacity: alpha, ...style }}
      onDragStart={e => e.preventDefault()}
      {...props}
    />
  );
}
