import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { formatPlaylistDuration } from "../services/playlist/playlist.service.js";

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
                src={playlist?.createdBy?.profileImg || "https://icon2.cleanpng.com/20190616/toj/kisspng-computer-icons-scalable-vector-graphics-the-noun-p-45-png-and-svg-self-icons-for-free-download-uihere-5d06e4d371e7f7.4084182615607328834666.jpg"}
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
