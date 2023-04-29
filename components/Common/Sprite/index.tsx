import ImgSprite from "./ImgSprite";
import SvgSprite from "./SvgSprite";

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
export default function Sprite(props: SpriteProps) {
  const SpriteComponent = props.color == null ? ImgSprite : SvgSprite;
  return <SpriteComponent {...props} />;
}
