import { useEffect, useRef } from "react";

export default function useLatest<T>(value: T): Readonly<React.MutableRefObject<T>> {
  const ref = useRef(value);
  useEffect(() => void (ref.current = value));
  return ref;
}
