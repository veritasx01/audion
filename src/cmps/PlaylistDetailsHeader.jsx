import { useSelector } from "react-redux";
import { formatPlaylistDuration } from "../services/playlist/playlist.service.js";
import profileImageFallback from "../assets/images/profile-image-fallback.webp";

export function PlaylistDetailsHeader({ playlist, onOpenModal }) {
  const libraryView = useSelector((state) => state.systemModule.libraryView);
  const nowPlayingView = useSelector(
    (state) => state.systemModule.nowPlayingView
  );

  return (
    <>
      <div className="playlist-header">
        <img
          className="playlist-cover"
          src={playlist.thumbnail}
          alt={playlist.title}
        />
        <div
          className={`playlist-info ${libraryView ? "" : "library-collapsed"} ${
            nowPlayingView ? "now-playing-expanded" : ""
          } ${playlist.title?.length <= 15 ? "short-title" : ""}`}
        >
          <span className="playlist-type">Playlist</span>
          <h1
            className={`playlist-title`}
            onClick={() => {
              if (!playlist.isLikedSongs) {
                onOpenModal();
              }
            }}
            title={playlist.isLikedSongs ? "" : "Click to edit"}
          >
            {playlist.title}
          </h1>
          {playlist.description && (
            <p className="playlist-description">{playlist.description}</p>
          )}
          <div className="playlist-metadata">
            <span className="creator">
              <img
                src={playlist?.createdBy?.profileImg || profileImageFallback}
                alt={playlist.createdBy.username}
              />
              {playlist.createdBy.fullName}
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
    </>
  );
}
