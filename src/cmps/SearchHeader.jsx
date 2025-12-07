import { useEffect } from "react";
import { SongResultCard } from "./SongResultCard";

const defaultSong = {
  title: "Song Title",
  artist: "the artist",
  thumbnail: `https://picsum.photos/seed/2/40`,
  duration: 200,
};

export function SearchHeader({ searchWord }) {
  useEffect(() => {}, [searchWord]);

  return (
    <div className="search-header-container">
      <div className="search-header-results">
        <div className="search-result-text-container">
          <section className="top-result-section">
            <h2>Top result</h2>
            <div className="top-result-card">
              <img
                className="result-card-image"
                src="https://i.scdn.co/image/ab67616d00001e02db6b8ae97f69fee1d432334d"
              ></img>
              <h1>Song Result Here</h1>
            </div>
          </section>
          <section className="songs-section">
            <h2>Songs</h2>
            <SongResultCard song={defaultSong}></SongResultCard>
            <SongResultCard song={defaultSong}></SongResultCard>
            <SongResultCard song={defaultSong}></SongResultCard>
            <SongResultCard song={defaultSong}></SongResultCard>
          </section>
        </div>
      </div>
    </div>
  );
}
