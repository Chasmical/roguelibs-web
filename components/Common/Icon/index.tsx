import Sprite, { SpriteProps } from "@components/Common/Sprite";

export interface IconProps extends Omit<SpriteProps, "src"> {
  type: IconType;
}

export default function Icon({ type, ...props }: IconProps) {
  return <Sprite src={AllIconPaths[type]} crisp {...props} />;
}

export const AllIconTypes = [
  "loading",
  "check",
  "cross",
  "check_small",
  "cross_small",
  "visibility",
  "visibility_off",
  "nugget",
  "upload",
  "download",
  "discord",
  "copy",
  "edit",
  "save",
  "link",
  "door",
  "undo",
  "add",
  "options",
  "options_vert",
  "bell",
  "note",
  "lightbulb",
  "info",
  "caution",
  "danger",
] as const;

export const AllIconPaths = (() => {
  const paths = {} as Record<IconType, string>;
  for (const icon of AllIconTypes) {
    const ext = icon === "loading" ? "gif" : "png";
    paths[icon] = `/icons/${icon}.${ext}`;
  }
  return paths;
})();

export type IconType = (typeof AllIconTypes)[number];
