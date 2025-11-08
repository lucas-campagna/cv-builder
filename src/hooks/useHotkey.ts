import { useEffect } from "react";

const useHotkey = (
  {
    hotkey,
    callback,
  }: {
    hotkey: string;
    callback: CallableFunction;
  },
  deps: any[] = []
) => {
  useEffect(() => {
    const isUsingCtrlKey = hotkey.toLowerCase().includes("ctrl");
    const isUsingShiftKey = hotkey.toLowerCase().includes("shift");
    const isUsingAltKey = hotkey.toLowerCase().includes("alt");
    const key = hotkey
      .toLowerCase()
      .replace("ctrl+", "")
      .replace("shift+", "")
      .replace("alt+", "");
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === key &&
        ((isUsingCtrlKey && (event.metaKey || event.ctrlKey)) ||
          (isUsingShiftKey && event.shiftKey) ||
          (isUsingAltKey && event.altKey) ||
          (!isUsingCtrlKey && !isUsingShiftKey && !isUsingAltKey))
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, deps);
};

export default useHotkey;
