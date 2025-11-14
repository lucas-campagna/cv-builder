import { useEffect } from "react";

const useHotkeys = (
  hotkeys: {
    [hotkey: string]: CallableFunction;
  },
  deps: any[] = []
) => {
  useEffect(() => {
    const events = Object.entries(hotkeys).map(([hotkey, callback]) => {
      const hasCtrl = hotkey.toLowerCase().includes("ctrl");
      const hasShift = hotkey.toLowerCase().includes("shift");
      const hasAlt = hotkey.toLowerCase().includes("alt");
      const key = hotkey
        .toLowerCase()
        .replace("ctrl+", "")
        .replace("shift+", "")
        .replace("alt+", "");
      const handleKeyDown = (event: KeyboardEvent) => {
        const pressedKey = event.key.toLowerCase();
        const pressedCtrl = event.metaKey || event.ctrlKey;
        const pressedShift = event.shiftKey;
        const pressedAlt = event.altKey;
        if (
          pressedKey === key &&
          pressedCtrl === hasCtrl &&
          pressedShift === hasShift &&
          pressedAlt === hasAlt
        ) {
          event.preventDefault();
          callback();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    });
    return () => events.forEach((cb) => cb());
  }, deps);
};

export default useHotkeys;
