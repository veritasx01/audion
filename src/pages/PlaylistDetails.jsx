import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExtractColors } from "react-extract-colors";
import { playlistService } from "../services/playlist.service";
import { sortColorsByBrightness } from "../services/util.service.js";
import { updatePlaylistDetails } from "../store/actions/playlist.action.js";
import { PlaylistDetailsHeader } from "../cmps/PlaylistDetailsHeader.jsx";
import { PlaylistDetailsHeaderControlls } from "../cmps/PlaylistDetailsControlls.jsx";
import { PlaylistDetailsEditModal } from "../cmps/PlaylistDetailsEditModal.jsx";
import { PlaylistDetailsTable } from "../cmps/PlaylistDetailsTable.jsx";
import { PlaylistSongSearch } from "../cmps/PlaylistSongSearch.jsx";

export function PlaylistDetails() {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [gradientColors, setGradientColors] = useState(null);
  const { colors } = useExtractColors(playlist?.thumbnail); // extract colors from playlist thumbnail for gradient background

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

  const onOpenModal = () => {
    setShowEditModal(true);
    console.log("Opening edit modal");
  };

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
            onOpenModal={onOpenModal}
          />
          <div className="playlist-header-separator" />
          <PlaylistDetailsHeaderControlls
            playlist={playlist}
            onOpenModal={onOpenModal}
          />
        </div>
      </div>

      <PlaylistDetailsEditModal
        playlist={playlist}
        showEditModal={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSavePlaylistDetails={onSavePlaylistDetails}
      />

      {/* Table section without gradient */}
      <PlaylistDetailsTable
        playlist={{ ...playlist }}
        loadPlaylist={loadPlaylist}
      />

      {/* Song search section */}
      <div className="playlist-header-separator" />
      <PlaylistSongSearch playlist={playlist} loadPlaylist={loadPlaylist} />
    </div>
  );
}
