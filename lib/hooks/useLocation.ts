import { useEffect, useState } from "react";

export default function useLocation(): Location | null {
  const [location, setLocation] = useState<Location | null>(null);
  useEffect(() => setLocation(window.location), []);
  return location;
}
