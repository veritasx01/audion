import { useState } from "react";
import fallbackImage from "../assets/images/black_image.jpg";

export function NowPlayingDetails({ songObj }) {
  const [inLibrary, setInLibrary] = useState(false);

  useState(() => {
    const isInLibrary = false; // check if songObj._id in liked songs
    setInLibrary(isInLibrary);
  }, []);

  return (
    <div className="now-playing-details-container">
      <img
        className="now-playing-image"
        src={songObj?.thumbnail || fallbackImage}
      ></img>
      <div style={{ position: "relative" }}>
        <p className="now-playing-title">{songObj?.title}</p>
        <p className="now-playing-artist">{songObj?.artist}</p>
        <button
          className={`now-playing-add-button hov-enlarge ${inLibrary ? "active" : ""}`}
          onClick={() => setInLibrary((prev) => !prev)}
        >
          <span className="size-24">{addToLibraryIcon(inLibrary)}</span>
        </button>
      </div>
    </div>
  );
}

function addToLibraryIcon(inLibrary) {
  if (inLibrary) {
    return (
      <svg viewBox="0 0 24 24" fill="#1ed760">
        <path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12m16.398-2.38a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308z"></path>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="#b2b2b2">
      <path d="M11.999 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m-11 9c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11"></path>
      <path d="M17.999 12a1 1 0 0 1-1 1h-4v4a1 1 0 1 1-2 0v-4h-4a1 1 0 1 1 0-2h4V7a1 1 0 1 1 2 0v4h4a1 1 0 0 1 1 1"></path>
    </svg>
  );
}
