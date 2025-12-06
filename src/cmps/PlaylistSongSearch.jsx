import { useState, useMemo } from "react";
import { songs } from "../assets/data/songs.js";
import { addSong } from "../store/actions/playlist.action.js";
import { searchIcon, clearIcon } from "../services/icon.service.jsx";
import { useDebounce } from "../customHooks/useDebounce.js";

export function PlaylistSongSearch({ playlist, loadPlaylist }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  // Auto-expand if playlist has no songs, otherwise start collapsed
  const [isExpanded, setIsExpanded] = useState(playlist.songs?.length === 0);

  const debouncedSetSearch = useDebounce((query) => {
    setDebouncedSearchQuery(query);
  }, 300);

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
      {!isExpanded ? (
        <div className="search-header">
          <button className="find-more-btn" onClick={() => setIsExpanded(true)}>
            Find more
          </button>
        </div>
      ) : (
        <>
          <div className="search-header">
            <h3>Let's find something for your playlist</h3>
          </div>
          <div className="search-controls">
            <div className="search-input-container">
              <div className="search-icon">
                {searchIcon({ height: 16, width: 16 })}
              </div>
              <input
                type="text"
                placeholder="Search for songs"
                value={searchQuery}
                onChange={(e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                  debouncedSetSearch(query);
                }}
                className="search-input"
                title="Search for songs to add to this playlist by either song title, artist, or album"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearchQuery("");
                  }}
                  title="Clear search"
                >
                  {clearIcon({
                    height: 16,
                    width: 16,
                    fill: "var(--text-base)",
                  })}
                </button>
              )}
            </div>
            <button
              className="close-search-btn"
              onClick={() => {
                setIsExpanded(false);
                setSearchQuery("");
                setDebouncedSearchQuery("");
              }}
              title="Close search"
            >
              {clearIcon({ height: 24, width: 24, fill: "var(--text-base)" })}
            </button>
          </div>
        </>
      )}

      {isExpanded && (
        <div className="search-results">
          {searchQuery && filteredSongs.length > 0 ? (
            <ul className="results-list">
              {filteredSongs.map((song) => (
                <li key={song._id} className="search-result-item">
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
                </li>
              ))}
            </ul>
          ) : (
            searchQuery &&
            debouncedSearchQuery && (
              <div className="no-results">
                <h3>No results found for "{debouncedSearchQuery}"</h3>
                <p>
                  Please make sure your words are spelled correctly, or use
                  fewer or different keywords.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
