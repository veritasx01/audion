import { useState, useEffect } from "react";

export function PlaylistDetailsEditModal({
  playlist,
  showEditModal,
  onClose,
  onSavePlaylistDetails,
}) {
  const initFormFields = () => ({
    title: playlist?.title || "",
    description: playlist?.description || "",
  });

  const [editForm, setEditForm] = useState(initFormFields);

  useEffect(() => {
    if (playlist && showEditModal) setEditForm(initFormFields());
  }, [playlist?.id, showEditModal]);

  // Handle Edit Playlist Details form submission
  const handleSave = (e) => {
    e.preventDefault();
    const updatedPlaylist = {
      ...playlist,
      title: editForm.title,
      description: editForm.description,
    };
    onSavePlaylistDetails(updatedPlaylist);
    onClose();
  };

  // Edit Playlist Details Modal
  return showEditModal && !playlist.isLikedSongs ? (
    <div className="playlist-edit-modal">
      <div className="modal-content">
        <h2>Edit Details</h2>
        <form onSubmit={handleSave} autoComplete="off">
          <div className="modal-field">
            <input
              id="playlist-title"
              value={editForm.title}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Add a name"
              required
            />
            <label htmlFor="playlist-title">Title</label>
          </div>
          <div className="modal-field">
            <textarea
              id="playlist-description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Add an optional description"
              rows={3}
            />
            <label htmlFor="playlist-description">Description</label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => onClose()}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}
