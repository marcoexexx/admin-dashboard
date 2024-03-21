import { useEffect } from "react";

export function useBeforeUnloadPage() {
  useEffect(() => {
    function handleBeforeUnload(evt: BeforeUnloadEvent) {
      const msg = "Are you sure you want to leave? Your changes may not be saved.";
      if (msg) {
        evt.preventDefault();
        evt.returnValue = msg;
        return msg;
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
}
