import { useState } from "react";
import fallbackImage from "../assets/images/black_image.jpg";
import { songs } from "../assets/data/songs";

const playlists = [
  { id: 1, color: "#e91429", song: songs[0] },
  { id: 2, color: "#1ed760", song: songs[1] },
  { id: 3, color: "#f59b23", song: songs[2] },
  { id: 4, color: "#006450", song: songs[3] },
  { id: 5, color: "#8e66ac", song: songs[4] },
  { id: 6, color: "#eb1e32", song: songs[5] },
  { id: 7, color: "#535353", song: songs[6] },
  { id: 8, color: "#1e3264", song: songs[7] },
];

const DEFAULT_COLOR = "#565656";

export function HomeHeader() {
  const [headerColor, setHeaderColor] = useState(DEFAULT_COLOR);
  return (
    <div className="gradient-header" style={{ backgroundColor: headerColor }}>
      <div className="playlist-card-wrapper">
        <div className="playlist-card-container">
          {/* 2. Map over data */}
          {playlists.map((playlist) => (
            <PlaylistCard
              song={playlist.song}
              key={playlist.id}
              onMouseEnter={() => setHeaderColor(playlist.color)}
              onMouseLeave={() => setHeaderColor(playlists[0].color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaylistCard({ song, onMouseEnter, onMouseLeave }) {
  return (
    <div
      className="playlist-card"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img
        src={song.thumbnail || fallbackImage}
        style={{ height: "100%", aspectRatio: "1" }}
      ></img>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <div>
          <a>{song.title}</a>
        </div>
      </div>
    </div>
  );
}
