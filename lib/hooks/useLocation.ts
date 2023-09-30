import { useLayoutEffect, useState } from "react";

export default function useLocation(): Location | null {
  const [location, setLocation] = useState<Location | null>(null);
  useLayoutEffect(() => setLocation(window.location), []);
  return location;
}
