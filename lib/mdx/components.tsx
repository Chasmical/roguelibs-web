import Link from "@components/Common/Link";
import type { MdxComponentProps } from ".";

export interface ComponentsConfiguration {}
export default function configureComponents(config?: ComponentsConfiguration): MdxComponentProps["components"] {
  return {
    a: Link as any,
  };
}
