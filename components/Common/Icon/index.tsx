import Sprite, { SpriteProps } from "@components/Common/Sprite";

export interface IconProps extends Omit<SpriteProps, "src"> {
  type: IconType;
}

export default function Icon({ type, ...props }: IconProps) {
  return <Sprite src={IconPaths[type]} crisp {...props} />;
}

export const IconPaths = {
  loading: "/icons/loading.gif",
  check: "/icons/check.png",
  cross: "/icons/cross.png",
  check_small: "/icons/check_small.png",
  cross_small: "/icons/cross_small.png",
  visibility: "/icons/visibility.png",
  visibility_off: "/icons/visibility_off.png",
  nugget: "/icons/nugget.png",
  upload: "/icons/upload.png",
  download: "/icons/download.png",
  discord: "/icons/discord.png",
  copy: "/icons/copy.png",
  edit: "/icons/edit.png",
  save: "/icons/save.png",
  link: "/icons/link.png",
  door: "/icons/door.png",
  undo: "/icons/undo.png",
  add: "/icons/add.png",
  options: "/icons/options.png",
  options_vert: "/icons/options_vert.png",
} as const;

export type IconType = keyof typeof IconPaths;
