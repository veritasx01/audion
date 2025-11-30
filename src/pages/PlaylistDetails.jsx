import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
import { playlistService } from "../services/playlist.service";
import { sortColorsByBrightness } from "../services/util.service.js";
import {
  addSong,
  removeSong,
  updatePlaylistDetails,
  removePlaylist,
} from "../store/actions/playlist.action.js";
import { updateSongObject, togglePlaying } from "../store/actions/song.action";
import playIcon from "../assets/icons/play.svg";
import pauseIcon from "../assets/icons/pause.svg";
import checkmarkIcon from "../assets/icons/checkmark.svg";
import moreOptionsIcon from "../assets/icons/meatball-menu.svg";

import { PlaylistDetailsHeader } from "../cmps/PlaylistDetailsHeader.jsx";
import { PlaylistDetailsHeaderControlls } from "../cmps/PlaylistDetailsControlls.jsx";
import { PlaylistDetailsTable } from "../cmps/PlaylistDetailsTable.jsx";

export function PlaylistDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [extractedColors, setExtractedColors] = useState(null);
  const isPlaying = useSelector((store) => store.songModule.isPlaying);
  const playingSongId = useSelector((store) => store.songModule.songObj._id);
  const playlists = useSelector((store) => store.playlistModule.playlists);
  const { colors } = useExtractColors(playlist?.thumbnail); // extract colors from playlist thumbnail for gradient background
  const otherPlaylists = useMemo(
    () =>
      playlists
        .filter((pl) => pl._id !== playlistId)
        .map((pl) => ({ _id: pl._id, title: pl.title })),
    [playlists, playlistId]
  );

  useEffect(() => {
    loadPlaylist();
  }, [playlistId]);

  useEffect(() => {
    setExtractedColors(sortColorsByBrightness(colors));
  }, [colors]);

  function loadPlaylist() {
    playlistService
      .getById(playlistId)
      .then(setPlaylist)
      .catch((err) => {
        console.error("Error loading playlist to playlist details:", err);
        navigate("/");
      });
  }

  function setCurrentSong(song) {
    dispatch(updateSongObject(song));
  }

  // util function for setting style for header gradient layers: background and a dark overlay
  function createGradientStyle(layerIndex) {
    let gradientColors;
    if (layerIndex === 0) {
      gradientColors =
        extractedColors?.length > 0
          ? `linear-gradient(to bottom, ${extractedColors.join(", ")})`
          : "linear-gradient(to bottom,  #d1d1d1ff, #3e3e3eff)"; // default fallback if playlist has no thumbnail
    } else {
      gradientColors =
        "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))";
    }
    return {
      position: "absolute",
      inset: 0,
      background: gradientColors,
      filter: layerIndex === 0 ? "blur(1px) brightness(0.7)" : "none",
      zIndex: layerIndex,
    };
  }

  if (!playlist) return <div>Loading...</div>;

  return (
    <div className="playlist-details">
      {/* Header section with gradient background */}
      <div className="playlist-header-section" style={{ position: "relative" }}>
        {/* Gradient background for header */}
        <div className="playlist-header-bg" style={createGradientStyle(0)} />

        {/* Dark overlay for better text readability on lighter gradient backgrounds */}
        <div style={createGradientStyle(1)} />

        {/* Header content on top of gradient */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <PlaylistDetailsHeader
            playlist={playlist}
            onUpdatePlaylistDetails={setPlaylist}
            onSavePlaylistDetails={updatePlaylistDetails}
          />
          <PlaylistDetailsHeaderControlls />
        </div>
      </div>

      {/* Table section without gradient */}
      <PlaylistDetailsTable
        playlist={{ ...playlist }}
        playingSongId={playingSongId}
        isPlaying={isPlaying}
        setCurrentSong={setCurrentSong}
        onRemoveSong={removeSong}
        onAddSong={addSong}
        otherPlaylists={otherPlaylists}
        loadPlaylist={loadPlaylist}
      />
    </div>
  );
}
