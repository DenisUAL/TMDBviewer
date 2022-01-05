import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  saveToLocalStorageFavorites,
  saveGenresLocal,
  readFromLocalStorageFavorites,
} from "../utils";

import API_KEY from "../API_key";
import Context from "../context";

import Loader from "./Loader";
import Movie from "./Movie";
import SearchBar from "./SearchBar";

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setCurrentPage] = useState(1);
  const [isNewMoviesLoading, setNewMoviesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(readFromLocalStorageFavorites());

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

  function scrollSubscribe() {
    document.addEventListener("scroll", (e) => {
      if (
        e.target.scrollingElement.scrollHeight ==
        e.target.scrollingElement.scrollTop + window.innerHeight
      ) {
        setNewMoviesLoading(true);
      }
    });
  }

  // -----------------infinite scroll loader--------------------------

  useEffect(() => {
    isNewMoviesLoading && setCurrentPage(page + 1);
  }, [isNewMoviesLoading]);

  //-----------------search request handling--------------------------

  useEffect(() => {
    searchQuery.trim().length
      ? fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${searchQuery}&page=${page}`
        )
          .then((data) => data.json())
          .then((newMovies) => {
            setMovies(newMovies.results);
          })
      : setCurrentPage(1);
  }, [searchQuery]);

  //-----------------infinite scroll fetch , popular movies fetch-------------------------

  useEffect(() => {
    let tempMovies = [];
    if (!movies.length) {
      scrollSubscribe();
    }

    !searchQuery.trim().length &&
      fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
      )
        .then((data) => data.json())
        .then((newMovies) => {
          tempMovies = [...movies, ...newMovies.results];
        })
        .then(() => {
          if (!genres.length) {
            fetch(
              `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
            )
              .then((response) => response.json())
              .then(({ genres }) => {
                setGenres(genres);
                saveGenresLocal(genres);
                setMovies(tempMovies);
                setLoading(false);
              });
          } else {
            setMovies(tempMovies);
            setNewMoviesLoading(false);
            setLoading(false);
          }
        })
        .catch((e) => console.error(e));
  }, [page, searchQuery]);

  //////////////////////////////////////////////////

  return (
    <Context.Provider value={{ addMovieToFav, removeMovieFromFav, favorites }}>
      <div className="container">
        <div className="row">
          <div className="col-6 page-title d-flex justify-content-start">
            Popular movies
          </div>
          <div className="col-6 search d-flex justify-content-center">
            <SearchBar onChange={setSearchQuery} value={searchQuery} />
          </div>

          <Link
            className="col-6 d-flex justify-content-end mb-3 mt-3"
            to="/favorites"
          >
            <button
              className="btn nav-button btn-outline-secondary"
              type="button"
              id="button-addon2"
            >
              Favorites
            </button>
          </Link>
        </div>

        <div className="movie-list row d-flex justify-content-center">
          {loading && !movies.length ? (
            <div className="col-auto">
              <Loader />
            </div>
          ) : (
            movies.map((movie) => (
              <Movie key={movie.id} genres={genres} {...movie} />
            ))
          )}
          <div className="col-auto">{isNewMoviesLoading && <Loader />}</div>
        </div>
      </div>
    </Context.Provider>
  );
}

export default HomePage;
