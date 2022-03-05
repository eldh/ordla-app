import React, { useState, useEffect } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (cb: (prevState: T) => T) => void, boolean] {
  const { getItem, setItem } = useAsyncStorage(key);
  const [v, setV_] = useState<T>(initialValue);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  useEffect(() => {
    // Buggy!
    getItem().then((value) => {
      setHasLoaded(true);
      setV(value ? JSON.parse(value) : initialValue);
    });
  }, [key]);
  // When value changes, update local storage
  useEffect(() => {
    if (v) {
      setItem(JSON.stringify(v));
    }
  }, [v]);

  const setV = React.useCallback((cb: (prevState: T) => T) => {
    setV_(cb);
  }, []);

  return [v, setV, hasLoaded];
}
