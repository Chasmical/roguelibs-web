import IconButton from "@components/Common/IconButton";
import Tooltip, { TooltipProps } from "@components/Common/Tooltip";
import useLocation from "@lib/hooks/useLocation";
import { useId } from "react";

export interface CopyLinkProps {
  href: string;
  permanent?: boolean;
  place?: TooltipProps["place"];
}
export default function CopyLink({ href, permanent, place }: CopyLinkProps) {
  const location = useLocation();
  const tooltipId = useId();

  function copyLink() {
    navigator.clipboard.writeText(`${location!.origin}${href}`);
  }

  return (
    <>
      <IconButton data-tooltip-id={tooltipId} type="link" onClick={copyLink} />
      <Tooltip
        id={tooltipId}
        openOnClick
        content={permanent ? "Copied permanent link!" : "Copied link!"}
        place={place}
      />
    </>
  );
}
