import { useEffect, useState } from "react";
import fallbackImage from "../assets/images/black_image.jpg";
import { useSongController } from "../customHooks/useSongController";
import { songService } from "../services/song/song.service";
import { useExtractColors } from "react-extract-colors";
import { sortColorsByBrightness } from "../services/util.service";
import { pauseIcon, playIcon } from "../services/icon.service";

const songs = await songService.query();

const playlistsDemo = [];
for (let i = 0; i < 8; i++) {
  playlistsDemo.push({
    _id: i + 1,
    song: songs[i],
    thumbnail: songs[i].thumbnail,
  });
}

const DEFAULT_COLOR = "#565656";

export function HomeHeader() {
  const [headerColor, setHeaderColor] = useState(DEFAULT_COLOR);
  const [playlists, setPlaylists] = useState(playlistsDemo);

  return (
    <div className="gradient-header" style={{ backgroundColor: headerColor }}>
      <div className="playlist-card-wrapper">
        <div className="playlist-card-container">
          {/* 2. Map over data */}
          {playlists.map((playlist) => (
            <PlaylistCard
              song={playlist.song}
              key={playlist._id}
              setHeaderColor={setHeaderColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaylistCard({ song, setHeaderColor }) {
  const [mainColor, setMainColor] = useState("#fff");
  const { colors } = useExtractColors(song.thumbnail);

  useEffect(() => {
    let sortedColors = sortColorsByBrightness(colors, 3);
    setMainColor(sortedColors[0]);
  }, [colors]);

  const { isCurrentSongPlaying, toggleSong } = useSongController(song);

  return (
    <div
      className="playlist-card"
      onMouseEnter={() => {
        setHeaderColor(mainColor);
      }}
      onMouseLeave={() => setHeaderColor(DEFAULT_COLOR)}
    >
      <img
        className="playlist-image"
        src={song.thumbnail || fallbackImage}
      ></img>
      <button className="play-button" onClick={() => toggleSong(song)}>
        <span className="play-button-span">
          {isCurrentSongPlaying
            ? pauseIcon({ height: "24px", width: "24px", fill: "black" })
            : playIcon({ height: "24px", width: "24px", fill: "black" })}
        </span>
      </button>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <div>
          <a>{song.title}</a>
        </div>
      </div>
    </div>
  );
}

/*
function playIcon(paused) {
  if (paused) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7z"></path>
      </svg>
    );
  }
  return (
    <svg className="size-24" viewBox="0 0 24 24" fill="#000">
      <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
    </svg>
  );
}
*/
