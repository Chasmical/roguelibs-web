import { useLayoutEffect, useState } from "react";

export default function useLocation(): Location | undefined {
  const [location, setLocation] = useState<Location>();
  // useLayoutEffect prevents rendering with uninitialized value
  useLayoutEffect(() => setLocation(window.location), []);
  return location;
}
