"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export default function LocalTime({ className = "" }: { className?: string }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: site.timezone,
        }).format(new Date())
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`mono-s tabular-nums ${className}`}>
      Vadodara {time} IST
    </span>
  );
}
