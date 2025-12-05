import { useState, useEffect, useMemo } from "react";
import { songs } from "../assets/data/songs.js";
import { addSong } from "../store/actions/playlist.action.js";
import { searchIcon } from "../services/icon.service.jsx";

export function PlaylistSongSearch({ playlist, loadPlaylist }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter songs based on search query and exclude songs already in playlist
  const filteredSongs = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];

    const playlistSongIds = new Set(
      playlist.songs?.map((song) => song._id) || []
    );

    return songs
      .filter(
        (song) =>
          !playlistSongIds.has(song._id) && // Exclude songs already in playlist
          (song.title
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
            song.artist
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()) ||
            song.albumName
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()))
      )
      .slice(0, 10); // Limit to 10 results
  }, [debouncedSearchQuery, playlist.songs]);

  const handleAddSong = async (song) => {
    try {
      await addSong(playlist._id, song);
      loadPlaylist();
      // Don't clear search to allow adding multiple songs
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="playlist-song-search">
      <div className="search-header">
        <h3>Let's find something for your playlist</h3>
      </div>

      <div className="search-input-container">
        <div className="search-input-wrapper">
          <div className="search-icon">
            {searchIcon({ height: 16, width: 16 })}
          </div>
          <input
            type="text"
            placeholder="Search for songs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="search-input"
            title="Search for songs to add to this playlist by either song title, artist, or album"
          />
        </div>
      </div>

      {isExpanded && searchQuery && (
        <div className="search-results">
          {filteredSongs.length > 0 ? (
            <div className="results-list">
              {filteredSongs.map((song) => (
                <div key={song._id} className="search-result-item">
                  <div className="song-info">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="song-thumbnail"
                    />
                    <div className="song-details">
                      <div className="song-title">{song.title}</div>
                      <div className="song-artist">{song.artist}</div>
                    </div>
                  </div>
                  <div className="song-album">{song.albumName}</div>
                  <div className="song-duration">
                    {formatDuration(song.duration)}
                  </div>
                  <button
                    className="add-song-btn"
                    onClick={() => handleAddSong(song)}
                    title={`Add "${song.title}" to playlist`}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          ) : debouncedSearchQuery ? (
            <div className="no-results">
              <p>No songs found matching "{debouncedSearchQuery}"</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Click outside to collapse */}
      {isExpanded && (
        <div className="search-overlay" onClick={() => setIsExpanded(false)} />
      )}
    </div>
  );
}
