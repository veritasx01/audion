import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateSongObject,
  updateCurrentSong,
} from "../store/actions/song.action";

export function SongCarousel({ songs, title = "title" }) {
  const [offset, setOffset] = useState(0);
  const moveLeft = () => setOffset((prev) => Math.max(0, prev - 3));
  const moveRight = () =>
    setOffset((prev) => Math.min(songs.length - 7, prev + 3));

  const dispatch = useDispatch();
  const changeToSong = (url, songObj) => {
    dispatch(updateCurrentSong(url));
    dispatch(updateSongObject(songObj));
  };
  return (
    <div className="carousel-inner" style={{ paddingLeft: "28px", overflow: "hidden" }}>
      <h1 className="carousel-title">{title}</h1>
      <button
        className="left-button carousel-button hov-enlarge"
        onClick={moveLeft}
      >
        {leftArrow()}
      </button>
      <div
        className="song-carousel-container"
        style={{ transform: `translate(-${offset * 200}px)` }}
      >
        <div className="song-carousel">
          {songs.map((song, idx) => (
            <div key={idx} className="song-card">
              <div
                style={{ width: "100%" }}
                onClick={() => changeToSong(song.url, song)}
              >
                <img src={song.thumbnail} alt={song.title} />
                <p className="card-title">{song.title}</p>
                <p className="card-artist">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="right-button carousel-button hov-enlarge"
        onClick={moveRight}
      >
        {rightArrow()}
      </button>
    </div>
  );
}

function leftArrow() {
  return (
    <span className="size-16">
      <svg viewBox="0 0 16 16" fill="#b2b2b2">
        <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0"></path>
      </svg>
    </span>
  );
}

function rightArrow() {
  return (
    <span className="size-16">
      <svg viewBox="0 0 16 16" fill="#b2b2b2">
        <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0"></path>
      </svg>
    </span>
  );
}
