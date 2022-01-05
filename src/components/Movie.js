import React, { useContext } from "react";
import FavStar from "./FavStar";
import Context from "../context";
import { Link } from "react-router-dom";

function Movie({ isCarouselItem, genres, ...props }) {
  const { addMovieToFav, removeMovieFromFav } = useContext(Context);
  const genresList = props.genre_ids
    ? props.genre_ids
        .map(
          (id) =>
            genres.find((item) => {
              if (item.id === id) {
                return item.name;
              }
            }).name
        )
        .join(", ")
    : genres.map((genre) => genre.name).join(", ");

  function toggleFavList(starred) {
    starred ? addMovieToFav(props) : removeMovieFromFav(props.id);
  }

  const cardClassNames = isCarouselItem ? "card carouselItem" : "card";

  return (
    <div className={cardClassNames}>
      <img
        src={`https://image.tmdb.org/t/p/original${props.poster_path}`}
        className="card-img-top poster"
        alt="Loading..."
        loading="lazy"
      />
      <div className="card-body">
        <h5 className="card-title movie-title">{props.title}</h5>
        <p className="card-text genres-text">{genresList}</p>
        <div className="d-flex button-container justify-content-between p-2 bd-highlight">
          <Link to={`/movie/${props.id}`}>
            <button className="btn button btn-primary">More</button>
          </Link>
          <div className="star">
            <FavStar id={props.id} onToggle={toggleFavList} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Movie;
