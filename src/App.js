import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Favorites from "./components/Favorites";
import HomePage from "./components/HomePage";
import MoviePage from "./components/MoviePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route exact path="/movie/:id" element={<MoviePage />} />
    </Routes>
  );
}

export default App;
