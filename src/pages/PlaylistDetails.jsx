import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { playlistService } from "../services/playlist.service";
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
  const isPlaying = useSelector((store) => store.songModule.isPlaying);
  const playingSongId = useSelector((store) => store.songModule.songObj._id);
  const playlists = useSelector((store) => store.playlistModule.playlists);
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

  if (!playlist) return <div>Loading...</div>;

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

  return (
    <div className="playlist-details">
      {/* Background Blur Setup // TODO: replace with Gradient */}
      <div
        className="playlist-bg"
        style={{
          background: `url(${playlist.thumbnail}) center/cover no-repeat`,
        }}
      />

      {/* Playlist Header Section */}
      <PlaylistDetailsHeader
        playlist={playlist}
        onUpdatePlaylistDetails={setPlaylist}
        onSavePlaylistDetails={updatePlaylistDetails}
      />
      <PlaylistDetailsHeaderControlls />
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
