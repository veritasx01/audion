import { useEffect, useState } from "react";
import { SongResultCard } from "./SongResultCard";
import { songService } from "../services/song.service";
import fallbackImage from "../assets/images/black_image.jpg";

const defaultSongs = [
  {
    title: "Song Title 1",
    artist: "the artist 1",
    thumbnail: `https://picsum.photos/seed/1/40`,
    duration: 122,
  },
  {
    title: "Song Title 2",
    artist: "the artist 2",
    thumbnail: `https://picsum.photos/seed/2/40`,
    duration: 227,
  },
  {
    title: "Song Title 3",
    artist: "the artist 3",
    thumbnail: `https://picsum.photos/seed/3/40`,
    duration: 183,
  },
  {
    title: "Song Title 4",
    artist: "the artist 4",
    thumbnail: `https://picsum.photos/seed/4/40`,
    duration: 250,
  },
];

export function SearchHeader({ searchWord }) {
  const [topResult, setTopResult] = useState({});
  const [songsResult, setSongsResult] = useState(defaultSongs);
  useEffect(() => {
    // add searching mechanism here
    const loadSongs = async () => {
      const songs = await songService.query({ freeText: searchWord });
      setSongsResult(songs.slice(0, 4));
    };
    loadSongs();
  }, [searchWord]);

  return (
    <div className="search-header-container">
      <div className="search-header-results">
        <div className="search-result-text-container">
          <section className="top-result-section">
            <h2>Top result</h2>
            <div className="top-result-card">
              <img
                className="result-card-image"
                src={songsResult[0]?.thumbnail || fallbackImage}
              ></img>
              <h1>{songsResult[0]?.title || ""}</h1>
            </div>
          </section>
          <section className="songs-section">
            <h2>Songs</h2>
            {songsResult.map((song) => (
              <SongResultCard key={song._id} song={song}></SongResultCard>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
