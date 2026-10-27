"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// le globe (et ses données géographiques) n'est téléchargé que sur grand écran
const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function GlobeLoader() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(min-width: 981px)");
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return on ? <Globe /> : null;
}
