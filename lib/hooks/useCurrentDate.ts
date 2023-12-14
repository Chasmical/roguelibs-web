"use client";
import { formatDate } from "@lib/utils/date";
import { useEffect, useState } from "react";

export default function useCurrentDate(interval = 1000) {
  const [date, setDate] = useState(() => new Date());

  useEffect(() => {
    const ref = setInterval(() => setDate(new Date()), interval);
    return () => clearInterval(ref);
  }, [interval]);

  return date;
}

export function CurrentDate({ interval = 1000 }: { interval?: number }) {
  const date = useCurrentDate(interval);
  return formatDate(date);
}
