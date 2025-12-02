import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
import { playlistService } from "../services/playlist.service";
import {
  updateRgbaColorsAlpha,
  sortColorsByBrightness,
} from "../services/util.service.js";
import {
  addSong,
  removeSong,
  updatePlaylistDetails,
  removePlaylist,
} from "../store/actions/playlist.action.js";
import { updateSongObject, togglePlaying } from "../store/actions/song.action";
import checkmarkIcon from "../assets/icons/checkmark.svg";

import { PlaylistDetailsHeader } from "../cmps/PlaylistDetailsHeader.jsx";
import { PlaylistDetailsHeaderControlls } from "../cmps/PlaylistDetailsControlls.jsx";
import { PlaylistDetailsTable } from "../cmps/PlaylistDetailsTable.jsx";

export function PlaylistDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [gradientColors, setGradientColors] = useState(null);
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
    if (!colors || colors.length === 0) return;
    const sortedColors = sortColorsByBrightness(colors, 3);

    // override darkest color with background color for better blending
    sortedColors[sortedColors.length - 1] = "var(--background-base)";

    setGradientColors(sortedColors);
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
  function createGradientStyle() {
    const colorPalette =
      gradientColors?.length > 0
        ? gradientColors.join(", ")
        : `var(--gray1), var(--background-base)`; // default fallback if playlist has no thumbnail
    return {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(to bottom, ${colorPalette})`,
      zIndex: 0,
    };
  }

  function onSavePlaylistDetails(updatedPlaylist) {
    setPlaylist(updatedPlaylist);
    updatePlaylistDetails(updatedPlaylist);
  }

  if (!playlist) return <div>Loading...</div>;

  return (
    <div className="playlist-details">
      {/* Header section with gradient background */}
      <div className="playlist-header-section" style={{ position: "relative" }}>
        {/* Gradient background for header */}
        <div className="playlist-header-bg" style={createGradientStyle(0)} />

        {/* Header content on top of gradient */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <PlaylistDetailsHeader
            playlist={playlist}
            onSavePlaylistDetails={onSavePlaylistDetails}
          />
          <div className="playlist-header-separator" />
          <PlaylistDetailsHeaderControlls playlist={playlist} />
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
