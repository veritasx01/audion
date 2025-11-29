import { useState } from "react";
import fallbackImage from "../assets/images/black_image.jpg";

const playlists = [
  { id: 2, color: "#e91429" },
  { id: 1, color: "#1ed760" },
  { id: 3, color: "#f59b23" },
  { id: 4, color: "#006450" },
  { id: 5, color: "#8e66ac" },
  { id: 6, color: "#eb1e32" },
  { id: 7, color: "#535353" },
  { id: 8, color: "#1e3264" },
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

function PlaylistCard({ onMouseEnter, onMouseLeave }) {
  return (
    <div
      className="playlist-card"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <img
        src={fallbackImage}
        style={{ height: "100%", aspectRatio: "1" }}
      ></img>
    </div>
  );
}
