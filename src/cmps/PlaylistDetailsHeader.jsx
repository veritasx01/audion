import { useEffect, useState, useMemo } from "react";
import { formatPlaylistDuration } from "../services/playlist/playlist.service.js";

export function PlaylistDetailsHeader({ playlist, onOpenModal }) {
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
            onClick={() => {
              onOpenModal();
            }}
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
                src={playlist.createdBy.profileImg}
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
