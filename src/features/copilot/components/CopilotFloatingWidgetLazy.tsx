"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CopilotFloatingWidget = dynamic(() => import("./CopilotFloatingWidget"), {
  ssr: false,
});

export default function CopilotFloatingWidgetLazy() {
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    const load = () => setCanLoad(true);
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const idleHandle = idleWindow.requestIdleCallback(load, { timeout: 2500 });

      return () => {
        idleWindow.cancelIdleCallback?.(idleHandle);
      };
    }

    const timeoutHandle = window.setTimeout(load, 1500);

    return () => {
      window.clearTimeout(timeoutHandle);
    };
  }, []);

  if (!canLoad) {
    return null;
  }

  return <CopilotFloatingWidget />;
}
