export function saveToLocalStorageFavorites(movies) {
  localStorage.setItem("localFavorites", JSON.stringify(movies));
}

export function saveGenresLocal(genres) {
  localStorage.setItem("localGenres", JSON.stringify(genres));
}

export function readFromLocalStorageFavorites() {
  const favMovies = localStorage.getItem("localFavorites");
  if (favMovies) return JSON.parse(favMovies);
  return [];
}

export function readGenresLocal() {
  const genres = localStorage.getItem("localGenres");
  if (genres) return JSON.parse(genres);
  return [];
}


