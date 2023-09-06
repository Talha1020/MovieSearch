import { useEffect, useState } from "react";
export function useLocalStorage(initialValue) {
  const [moviesWatched, setMoviesWatched] = useState(function () {
    const watch = localStorage.getItem("watched");
    return JSON.parse(watch);
  });

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(moviesWatched));
    },
    [moviesWatched]
  );
  return [moviesWatched, setMoviesWatched];
}
