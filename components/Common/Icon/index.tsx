import { SpriteProps } from "@components/Common/Sprite";
import { SpriteSheet, createSpriteSheet } from "./spritesheet";
import styles from "./index.module.scss";
import clsx from "clsx";

export interface IconProps extends Omit<SpriteProps, "src" | "color" | "crisp"> {
  type: IconType;
}

export default function Icon({ className, width, height, size, type, style, alpha, ...props }: IconProps) {
  const sheet = sheets.find(s => type in s.offsets)!;
  const offset = sheet.offsets[type];

  return (
    <div
      role="icon"
      className={clsx(styles.icon, sheet.className, className)}
      style={{
        width: width ?? size,
        height: height ?? size,
        opacity: alpha,
        backgroundPosition: `-${offset.x}00% -${offset.y}00%`,
        ...style,
      }}
      {...props}
    ></div>
  );
}

const commonIcons = createSpriteSheet({
  className: styles.common,
  types: [
    ["add", "edit", "copy", "save", "link", "visibility", "visibility_off", "undo"],
    ["download", "upload", "options", "options_vert", "door", "bell", "check", "cross"],
    ["person"],
    [],
    ["nugget", "discord", "gamebanana", "website", "google", "github"],
    ["info", "note", "lightbulb", "caution", "danger"],
    ["align1", "align2", "align3", "align4", "align5", "align6", "align7"],
  ],
});

const tinyIcons = createSpriteSheet({
  className: styles.tiny,
  types: [["check_small", "cross_small"]],
});

const animatedIcons = createSpriteSheet({
  className: styles.animated,
  types: [["loading"]],
});

const sheets: SpriteSheet[] = [commonIcons, tinyIcons, animatedIcons];

export type IconType =
  | keyof typeof commonIcons.offsets
  | keyof typeof tinyIcons.offsets
  | keyof typeof animatedIcons.offsets;
