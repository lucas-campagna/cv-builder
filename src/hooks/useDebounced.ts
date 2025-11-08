import { useRef, useEffect } from "react";

const useDebounced = (
  { func, delay = 1000 }: { func: Function; delay?: number },
  deps: any[] = []
) => {
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    clearTimeout(timerRef.current!);
    timerRef.current = setTimeout(() => {
      func();
      timerRef.current = null;
    }, delay);
  }, deps);
};
export default useDebounced;
