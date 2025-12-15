import { SongResultCard } from "./SongResultCard";
import fallbackImage from "../assets/images/black_image.jpg";
import { playIcon, pauseIcon } from "../services/icon.service.jsx";
import { useSongController } from "../customHooks/useSongController.jsx";

export function SearchHeader({ songs }) {
  const curSong = songs && songs.length > 0 ? songs[0] : null;
  const { isCurrentSongPlaying, toggleSong } = useSongController(curSong);

  return (
    <div className="search-header-container">
      <div className="search-header-results">
        <div className="search-result-text-container">
          <section className="top-result-section">
            <h2>Top result</h2>
            <div className="top-result-card">
              <img
                className="result-card-image"
                src={songs[0]?.thumbnail || fallbackImage}
              ></img>
              <h1>{songs[0]?.title || ""}</h1>
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
            {songs.map((song) => (
              <SongResultCard key={song._id} song={song}></SongResultCard>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
