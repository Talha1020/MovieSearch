import { useEffect } from "react";

export function useKey(key, active) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) active();
      }
      document.addEventListener("keydown", callback);

      return function (e) {
        document.removeEventListener("keydown", callback);
      };
    },
    [active, key]
  );
}
