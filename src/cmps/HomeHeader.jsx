import { useEffect, useState } from "react";
import fallbackImage from "../assets/images/black_image.jpg";
import { useExtractColors } from "react-extract-colors";
import { sortColorsByBrightness } from "../services/util.service";
import { pauseIcon, playIcon } from "../services/icon.service";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSongQueue,
  setPlaylistId,
  setSongQueue,
} from "../store/actions/songQueue.action";
import { setPlaying, togglePlaying } from "../store/actions/song.action";
import { playlistService } from "../services/playlist/playlist.service";
import { useNavigate } from "react-router";

const DEFAULT_COLOR = "#565656";

export function HomeHeader() {
  const [headerColor, setHeaderColor] = useState(DEFAULT_COLOR);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const loadPlaylists = async () => {
      let playlistsQuery = await playlistService.query();
      playlistsQuery = playlistsQuery.filter((pl) => !pl.isLikedSongs);
      playlistsQuery = playlistsQuery.slice(0, 8);
      setPlaylists(playlistsQuery);
    };
    loadPlaylists();
  }, []);

  return (
    <div className="gradient-header" style={{ backgroundColor: headerColor }}>
      <div className="playlist-card-wrapper">
        <div className="playlist-card-container">
          {/* 2. Map over data */}
          {playlists.map((playlist) => (
            <PlaylistCard
              playlist={playlist}
              key={playlist._id}
              setHeaderColor={setHeaderColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaylistCard({ playlist, setHeaderColor }) {
  const [mainColor, setMainColor] = useState("#fff");
  const { colors } = useExtractColors(playlist.thumbnail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const playlistId = useSelector((state) => state.songQueueModule.playlistId);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);

  useEffect(() => {
    let sortedColors = sortColorsByBrightness(colors, 3);
    setMainColor(sortedColors[0]);
  }, [colors]);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    // If it's already the current playlist (regardless of play state), just toggle
    if (playlist._id !== playlistId) {
      // Load this playlist and start playing
      dispatch(clearSongQueue());
      dispatch(setSongQueue([...playlist.songs]));
      dispatch(setPlaylistId(playlist._id));
      dispatch(setPlaying(true));
    } else {
      dispatch(togglePlaying());
    }
  };

  function goToPlaylistPage() {
    if (!playlist._id || playlist._id === "") return;
    navigate(`playlist/${playlist._id}`);
  }

  return (
    <div
      className="playlist-card"
      onClick={goToPlaylistPage}
      onMouseEnter={() => {
        setHeaderColor(mainColor);
      }}
      onMouseLeave={() => setHeaderColor(DEFAULT_COLOR)}
    >
      <img
        className="playlist-image"
        src={playlist?.thumbnail || fallbackImage}
      ></img>
      <button className="play-button" onClick={handlePlayPause}>
        <span className="play-button-span">
          {playlist._id === playlistId && isPlaying
            ? pauseIcon({ height: "24px", width: "24px", fill: "black" })
            : playIcon({ height: "24px", width: "24px", fill: "black" })}
        </span>
      </button>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <div>
          <a>{playlist.title}</a>
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
