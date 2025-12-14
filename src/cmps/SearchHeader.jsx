import { useEffect, useState } from "react";
import { SongResultCard } from "./SongResultCard";
import { songService } from "../services/song/song.service.js";
import fallbackImage from "../assets/images/black_image.jpg";
import { playIcon, pauseIcon } from "../services/icon.service.jsx";
import { useSongController } from "../customHooks/useSongController.jsx";
import { Loader } from "./Loader.jsx";

const defaultSongs = [
  {
    title: "",
    artist: "",
    thumbnail: `https://picsum.photos/seed/1/40`,
    duration: 122,
  },
  {
    title: "",
    artist: "",
    thumbnail: `https://picsum.photos/seed/2/40`,
    duration: 227,
  },
  {
    title: "",
    artist: "",
    thumbnail: `https://picsum.photos/seed/3/40`,
    duration: 183,
  },
  {
    title: "",
    artist: "",
    thumbnail: `https://picsum.photos/seed/4/40`,
    duration: 250,
  },
];

export function SearchHeader({ searchWord }) {
  const [songsResult, setSongsResult] = useState(defaultSongs);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // add searching mechanism here
    const loadSongs = async () => {
      setIsLoading(true);
      const songs = await songService.query({ freeText: searchWord });
      setIsLoading(false);
      setSongsResult(songs.slice(0, 4));
    };
    loadSongs();
  }, [searchWord]);

  const curSong = songsResult && songsResult.length > 0 ? songsResult[0] : null;

  const { isCurrentSongPlaying, toggleSong } = useSongController(curSong);

  if (isLoading) {
    return (
      <div style={{ padding: "100px" }}>
        <Loader></Loader>
      </div>
    );
  }

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
              <div style={{ position: "absolute" }}>
                <button className="results-play-button" onClick={toggleSong}>
                  <span className="play-button-span">
                    {isCurrentSongPlaying
                      ? pauseIcon({
                          height: "24px",
                          width: "24px",
                          fill: "black",
                        })
                      : playIcon({
                          height: "24px",
                          width: "24px",
                          fill: "black",
                        })}
                  </span>
                </button>
              </div>
            </div>
          </section>
          <section className="songs-result-section">
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
