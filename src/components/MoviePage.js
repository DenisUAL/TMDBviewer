import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import API_KEY from "../API_key";
import FavStar from "./FavStar";
import {
  saveToLocalStorageFavorites,
  readFromLocalStorageFavorites,
  readGenresLocal,
} from "../utils";
import Context from "../context";
import RecomendedCarousel from "./RecomendedCarousel";

export default function MoviePage() {
  const [movie, setMovie] = useState({});
  const [recomendedMovies, setRecomended] = useState([]);
  const [favorites, setFavorites] = useState(readFromLocalStorageFavorites());
  const movieId = useParams().id;
  const [keys] = useState([
    "budget",
    "genres",
    "homepage",
    "spoken_languages",
    "original_title",
    "production_companies",
    "production_countries",
    "release_date",
    "revenue",
    "runtime",
    "status",
    "tagline",
    "vote_average",
    "vote_count",
  ]);

  useEffect(() => {
    let thisMovie = {};
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    )
      .then((data) => data.json())
      .then((movie) => {
        thisMovie = movie;
      })
      .then(() => {
        fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`
        )
          .then((data) => data.json())
          .then((recomended) => {
            setMovie(thisMovie);
            setRecomended(recomended.results);
          });
      });
  }, [movieId]);

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

  function toggleFavList(starred) {
    starred ? addMovieToFav(movie) : removeMovieFromFav(movieId);
  }

  return (
    <Context.Provider value={{ addMovieToFav, removeMovieFromFav, favorites }}>
      <div className="container">
        <div className="row">
          <div className="col-6 page-title d-flex justify-content-start">
            {movie.title}
          </div>
          <div className="star" style={{ float: "none" }}>
            <FavStar id={movieId} onToggle={toggleFavList} />
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
        <div className="col">
          <div>
            <ul style={{ listStyle: "none" }}>
              <li>
                <img
                  style={{ width: "20vw" }}
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                />
              </li>
            </ul>
          </div>
          <div className="col">
            <ul style={{ listStyle: "none" }}>
              {Object.keys(movie).length &&
                keys.map((key) => {
                  switch (key) {
                    case "genres":
                      let genresList = movie[key]
                        .map((item) => item.name)
                        .join(", ");
                      return (
                        <li key={key}>
                          <strong>genres:</strong>
                          {` ${genresList}`}
                        </li>
                      );
                    case "production_companies":
                      let prodComps = movie[key]
                        .map((item) => item.name)
                        .join(", ");
                      return (
                        <li key={key}>
                          <strong>production companies:</strong>
                          {` ${prodComps}`}
                        </li>
                      );
                    case "production_countries":
                      let prodCountry = movie[key]
                        .map((item) => item.name)
                        .join(", ");
                      return (
                        <li key={key}>
                          <strong>production countries:</strong>
                          {` ${prodCountry}`}
                        </li>
                      );
                    case "spoken_languages":
                      let langs = movie[key]
                        .map((item) => item.name)
                        .join(", ");
                      return (
                        <li key={key}>
                          <strong>languages:</strong>
                          {` ${langs}`}
                        </li>
                      );
                    default:
                      return (
                        <li key={key}>
                          <strong>{`${key.split("_").join(" ")}:`}</strong>
                          {` ${movie[key]}`}
                        </li>
                      );
                  }
                })}
                <h4>Overview:</h4>
                <p style={{width: "40vw"}}>{movie.overview}</p>
            </ul>
          </div>
        </div>
        <RecomendedCarousel
          items={recomendedMovies}
          genres={readGenresLocal()}
        />
      </div>
    </Context.Provider>
  );
}
