import { useEffect, useState, useMemo } from "react";
import { formatPlaylistDuration } from "../services/playlist.service.js";
import "../assets/styles/cmps/PlaylistDetailsHeader.css";

export function PlaylistDetailsHeader({
  playlist,
  onUpdatePlaylistDetails,
  onSavePlaylistDetails,
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="playlist-header">
        <img
          className="playlist-cover"
          src={playlist.thumbnail}
          alt={playlist.title}
        />
        <div className="playlist-info">
          <span className="playlist-type">Playlist</span>
          <h1
            className="playlist-title"
            onClick={() => setShowEditModal(true)}
            title="Click to edit"
          >
            {playlist.title}
          </h1>
          {playlist.description && (
            <p className="playlist-description">{playlist.description}</p>
          )}
          <div className="playlist-metadata">
            <span className="creator">
              <img
                src={`https://randomuser.me/api/portraits/thumb/men/${Math.floor(
                  Math.random() * 100
                )}.jpg`}
                alt={playlist.createdBy.username}
              />
              {playlist.createdBy}
            </span>
            {playlist.songs.length > 0 && (
              <>
                <span className="separator"> • </span>
                <span>
                  {playlist.songs.length} song
                  {playlist.songs.length !== 1 ? "s" : ""}
                  {",\u00A0"}
                </span>
                <span>{formatPlaylistDuration(playlist)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/*Edit Playlist Modal*/}
      {showEditModal && (
        <div className="playlist-edit-modal">
          <div className="modal-content">
            <h2>Edit Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSavePlaylistDetails({ ...playlist });
                setShowEditModal(false);
              }}
              autoComplete="off"
            >
              <div className="modal-field">
                <input
                  id="playlist-title"
                  value={playlist.title}
                  onChange={(e) =>
                    onUpdatePlaylistDetails({
                      ...playlist,
                      title: e.target.value,
                    })
                  }
                  placeholder=" "
                  required
                />
                <label htmlFor="playlist-title">Title</label>
              </div>
              <div className="modal-field">
                <textarea
                  id="playlist-description"
                  value={playlist.description}
                  onChange={(e) =>
                    onUpdatePlaylistDetails({
                      ...playlist,
                      description: e.target.value,
                    })
                  }
                  placeholder=" "
                  rows={3}
                />
                <label htmlFor="playlist-description">Description</label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
