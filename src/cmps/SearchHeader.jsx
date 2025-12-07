import { useEffect } from "react";

export function SearchHeader({ searchWord }) {
  useEffect(() => {}, [searchWord]);

  return (
    <div className="search-header-container">
      <div className="search-header-results">
        <div className="search-result-text-container">
          <section className="top-result-section">
            <h2>Top result</h2>
            <div className="top-result-card">
              <div className="card-image-placeholder"></div>
              <h3>{searchWord || "Artist Name"}</h3>
              <span>Artist</span>
            </div>
          </section>
          <section className="songs-section">
            <h2>Songs</h2>
            <div className="result-song-list-item">
              <span>Song 1</span>
              <span>3:45</span>
            </div>
            <div className="result-song-list-item">
              <span>Song 2</span>
              <span>2:30</span>
            </div>
            <div className="result-song-list-item">
              <span>Song 3</span>
              <span>4:12</span>
            </div>
            <div className="result-song-list-item">
              <span>Song 4</span>
              <span>3:35</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
