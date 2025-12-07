import { useSelector } from "react-redux";
import fallbackImage from "../assets/images/black_image.jpg";
import { useState } from "react";

export function SongWidget() {
  const songObj = useSelector((state) => state.songModule.songObj);
  const [inLibrary, setInLibrary] = useState(false);

  useState(() => {
    const isInLibrary = false; // check if songObj._id in liked songs
    setInLibrary(isInLibrary);
  }, []);

  return (
    <div className="song-controls-container">
      <div>
        <img
          src={songObj.thumbnail || fallbackImage}
          alt="song widget photo"
        ></img>
      </div>
      <div className="song-description">
        <p className="widget-song-header">{songObj.title || "----------"}</p>
        <p className="widget-song-artist">{songObj.artist || "-------"}</p>
      </div>
      <div style={{ height: "16px", width: "16px", alignContent: "center", margin: "8px 8px" }}>
        <button
          className={`add-button hov-enlarge ${inLibrary ? "active" : ""}`}
          onClick={() => setInLibrary((prev) => !prev)}
        >
          <span className="size-16" aria-hidden="true">
            {addToLikedIcon(inLibrary)}
          </span>
        </button>
      </div>
    </div>
  );
}

function addToLikedIcon(addedToLiked = false) {
  if (addedToLiked) {
    return (
      <svg viewBox="0 0 16 16" fill="#1ed760">
        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z"></path>
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="#b0b0b0">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
      <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75"></path>
    </svg>
  );
}
