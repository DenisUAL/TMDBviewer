import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Movie from "./Movie";
import {
  saveToLocalStorageFavorites,
  readFromLocalStorageFavorites,
  readGenresLocal,
  saveGenresLocal
} from "../utils";
import Context from "../context";
import API_KEY from "../API_key";

function Favorites() {
  const [genres, setGenres] = useState(readGenresLocal());
  const [favorites, setFavorites] = useState(readFromLocalStorageFavorites());

  useEffect(() => {
    if (!genres.length) {
      fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
      )
        .then((response) => response.json())
        .then(({ genres }) => {
          setGenres(genres);
          saveGenresLocal(genres);
        });
    }
  },[]);

  function addMovieToFav(movie) {
    saveToLocalStorageFavorites([movie, ...favorites]);
    setFavorites([movie, ...favorites]);
  }

  function removeMovieFromFav(movieId) {
    let favMovies = readFromLocalStorageFavorites();
    favMovies = favMovies.filter((movie) => movie.id != movieId);
    saveToLocalStorageFavorites(favMovies);
    setFavorites(favMovies);
  }

  return (
    <Context.Provider value={{ addMovieToFav, removeMovieFromFav, favorites }}>
      <div className="container">
        <div className="row">
          <div className="col-6 page-title d-flex justify-content-start">
            Favorites
          </div>
          <Link className="col-6 d-flex justify-content-end mb-3 mt-3" to="/">
            <button
              className="btn nav-button btn-outline-secondary"
              type="button"
              id="button-addon2"
            >
              Back to popular
            </button>
          </Link>
        </div>

        <div className="movie-list row d-flex">
          {!favorites.length ? (
            <div className="col-auto">
              <p>Empty favorites list</p>
            </div>
          ) : (
            favorites.map((movie) => (
              <Movie key={movie.id} genres={genres} {...movie} />
            ))
          )}
        </div>
      </div>
    </Context.Provider>
  );
}

export default Favorites;
