import React, { useEffect, useRef } from "react";

// export function useUpdateEffect(
//   cb: React.EffectCallback,
//   deps: React.DependencyList
// ) {
//   const rendered = useRef(false);
//   useEffect(() => {
//     if (rendered.current) {
//       return cb();
//     } else {
//       rendered.current = true;
//     }
//   }, deps);
//   return rendered.current;
// }

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();
  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
};
export const useMountEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();
  useEffect(() => {
    if (isFirstMount) {
      return effect();
    }
  }, deps);
};

function useFirstMountState(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}
