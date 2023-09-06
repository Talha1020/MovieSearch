import { useEffect, useRef, useState } from "react";
import StarRating from "./starRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "e015e74c";

export default function AppNew() {
  const [watched, setWatched] = useState(function () {
    const watch = localStorage.getItem("watched");
    return JSON.parse(watch);
  });
  const [movies, setMovies] = useState(function () {
    const movieInit = localStorage.getItem("watched");
    return JSON.parse(movieInit);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState("");

  function OpenMovieHandler(Id) {
    setSelectedId((selectedId) => (selectedId === Id ? "" : Id));
  }
  function CloseMovieHandler(Id) {
    setSelectedId("");
  }
  function WatchedMovieHandler(watchedMovies) {
    setWatched((watched) => [...watched, watchedMovies]);
  }
  function HandleDeleteMovie(DesiredDeleteId) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== DesiredDeleteId)
    );
  }

  useEffect(function () {
    function callback(e) {
      if (e.code === "Escape") CloseMovieHandler();
    }
    document.addEventListener("keydown", callback);

    return function (e) {
      document.removeEventListener("keydown", callback);
    };
  }, []);

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("");
          const data = await res.json();

          if (data.Response === "False") throw new Error("");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }

      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NAV>
        <SEARCH query={query} setQuery={setQuery} />
        <RESULTTEXT movies={movies} />
      </NAV>

      <MAIN>
        <SEARCHRESULTSBOX>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <ListOfSearchResults
              OpenMovieHandler={OpenMovieHandler}
              movies={movies}
            />
          )}
          {error && <Error message={error} />}
          {/* //     
          I am using Finally block to set the state Isloading to false, i removed it from try block because on error it was 
          not executing. Since i used three different condiotnal statements with && operator, i used this method. 
          Otherwise i can use the code below mentioned with ternary operators with setIsloading still in try block.
          <Loader />
          //   ) : (
            //     <Error message={error} />
            //   )
            // ) : (
              
            // )} */}
        </SEARCHRESULTSBOX>

        <SEARCHRESULTSBOX>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              CloseMovieHandler={CloseMovieHandler}
              WatchedMovieHandler={WatchedMovieHandler}
              watched={watched}
            />
          ) : (
            <>
              <SummaryOfWatchedMovies watched={watched} />
              <GroupOfWatchedMovies
                HandleDeleteMovie={HandleDeleteMovie}
                watched={watched}
              />
            </>
          )}
        </SEARCHRESULTSBOX>
      </MAIN>
    </>
  );
}
// function MovieDetails() {
//   return <p>{selectedId}</p>;
// }
function MovieDetails({
  CloseMovieHandler,
  selectedId,
  WatchedMovieHandler,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((movie) => movie.imdbID)?.includes(selectedId);
  const ratingDisplayInDetails = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const myCount = useRef(0);
  useEffect(
    function () {
      if (userRating) myCount.current++;
    },
    [userRating]
  );
  useEffect(
    function () {
      async function FetchMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      FetchMovieDetails();
    },
    [selectedId]
  );
  // // if there are more details and you have to rearrange the data or have to take out the variables out of the object and then set it to the
  // new array or object, then we can use the prop in the new function to add the details. like below
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function onAddWatchedList() {
    // this function is creating object from data gathered from api request. Its being used as creater of object and then used as handler to
    // make the object in our StaticRange. Object plus handler state and these are set by Watchedmovie handler which
    // is being defined earlier with setState of usestate.
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      userRating,
      counterRating: myCount.current,
    };

    WatchedMovieHandler(newWatchedMovie);
    CloseMovieHandler();
  }

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button onClick={CloseMovieHandler} className="btn-back">
              &larr;
            </button>
            <img src={poster} alt={`poster of ${movie}`}></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            {!isWatched ? (
              <>
                <StarRating
                  maxRating={10}
                  size={24}
                  onUserRating={setUserRating}
                />
                {userRating > 0 && (
                  <button className="btn-add" onClick={onAddWatchedList}>
                    + Add to List
                  </button>
                )}{" "}
              </>
            ) : (
              <p>
                You watched this movie already and rated it{" "}
                {ratingDisplayInDetails} <span>⭐</span>
              </p>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading</p>;
}
function Error({ message }) {
  return (
    <p className="error">
      <span>🚨</span> {message}
    </p>
  );
}
function NAV({ children }) {
  return (
    <nav className="nav-bar">
      <LOGO />
      {children}
    </nav>
  );
}

function LOGO() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SEARCH({ query, setQuery }) {
  const InputEl = useRef(null);
  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === InputEl.current) return;
        if (e.code === "Enter") {
          InputEl.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);
    },
    [setQuery]
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={InputEl}
    />
  );
}

function RESULTTEXT({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function MAIN({ children }) {
  return <main className="main">{children}</main>;
}

function SEARCHRESULTSBOX({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function ListOfSearchResults({ movies, OpenMovieHandler }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <IndividualElementOfResults
          OpenMovieHandler={OpenMovieHandler}
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </ul>
  );
}
function IndividualElementOfResults({ movie, OpenMovieHandler }) {
  return (
    <li onClick={() => OpenMovieHandler(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SummaryOfWatchedMovies({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));

  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function GroupOfWatchedMovies({ watched, HandleDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <ListDetailsOfWatchedMovies
          key={movie.imdbID}
          HandleDeleteMovie={HandleDeleteMovie}
          movie={movie}
        />
      ))}
    </ul>
  );
}

function ListDetailsOfWatchedMovies({ movie, HandleDeleteMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => HandleDeleteMovie(movie.imdbID)}
        >
          {" "}
          &#9587;
        </button>
      </div>
    </li>
  );
}
