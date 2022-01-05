import React from "react";

function SearchBar({ onChange, value }) {
  return (
    <div className="input-group mb-3 mt-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search movie here"
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
    </div>
  );
}

export default SearchBar;
