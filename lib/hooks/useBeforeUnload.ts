import useEvent from "@lib/hooks/useEvent";

export default function useBeforeUnload(preventUnload: () => boolean) {
  useEvent(typeof window === "undefined" ? null : window, "beforeunload", e => {
    return preventUnload() && (e.preventDefault(), (e.returnValue = true));
  });
}
