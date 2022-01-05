import React from "react";
import Movie from "./Movie";

export default function RecomendedCarousel({ items, genres }) {
  return (
    <div className="carouselContainer">
      {items.length &&
        items.map((item) => (
          <Movie
            isCarouselItem={true}
            key={item.id}
            genres={genres}
            {...item}
          />
        ))}
    </div>
  );
}
