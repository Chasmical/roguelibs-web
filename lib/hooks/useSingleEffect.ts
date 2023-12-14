import { useEffect, useRef } from "react";

function useSingleEffectImpl(effect: React.EffectCallback, deps: []) {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    return effect();
  }, deps);
}

const useSingleEffect = process.env.NODE_ENV !== "development" ? useEffect : useSingleEffectImpl;

export default useSingleEffect;
