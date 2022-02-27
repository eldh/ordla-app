import { useState, useLayoutEffect } from "react";

export function useViewportHeight(): number | undefined {
  const [value, setValue] = useState<number>();

  useLayoutEffect(() => {
    const handler = () =>
      setValue(() => window.visualViewport?.height || window.innerHeight);
    handler();
    window.visualViewport?.addEventListener("resize", handler);

    return () => {
      window.visualViewport?.removeEventListener("resize", handler);
    };
  }, []);

  return value;
}
