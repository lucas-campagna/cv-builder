import { useRef, useEffect } from "react";

const useDebounced = (
  { callback, delay = 1000 }: { callback: Function; delay?: number },
  deps: any[] = []
) => {
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    clearTimeout(timerRef.current!);
    timerRef.current = setTimeout(() => {
      callback();
      timerRef.current = null;
    }, delay);
  }, deps);
};
export default useDebounced;
