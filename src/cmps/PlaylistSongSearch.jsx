import { useState, useEffect } from "react";
import { addSong } from "../store/actions/playlist.action.js";
import { searchIcon, clearIcon } from "../services/icon.service.jsx";
import { songService } from "../services/song/song.service.js";
import { formatTimeFromSecs } from "../services/util.service.js";
import { useDebounce } from "../customHooks/useDebounce.js";

export function PlaylistSongSearch({ playlist, loadPlaylist, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSetSearch = useDebounce((query) => {
    setDebouncedSearchQuery(query);
  }, 300);

  // Fetch songs when debouncedSearchQuery changes
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setFilteredSongs([]);
      return;
    }

    setIsLoading(true);
    const playlistSongIds = new Set(
      playlist.songs?.map((song) => song._id) || []
    );

    songService
      .query({ freeText: debouncedSearchQuery })
      .then((songs) => {
        const matchedSongs = songs.filter(
          (song) => !playlistSongIds.has(song._id) // Exclude songs already in the playlist
        );
        setFilteredSongs(matchedSongs.slice(0, 10)); // Limit to 10 results
      })
      .catch((error) => {
        console.error("Error searching songs:", error);
        setFilteredSongs([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
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

  return (
    <div className="playlist-song-search">
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
            onClose();
            setSearchQuery("");
            setDebouncedSearchQuery("");
          }}
          title="Close search"
        >
          {clearIcon({ height: 24, width: 24, fill: "var(--text-base)" })}
        </button>
      </div>

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
                    <div className="song-title" title="Song title">
                      {song.title}
                    </div>
                    <div className="song-artist" title="Artist">
                      {song.artist}
                    </div>
                  </div>
                </div>
                <div className="song-album" title="Album">
                  {song.albumName}
                </div>
                <div className="song-duration" title="Song Duration">
                  {formatTimeFromSecs(song.duration)}
                </div>
                <button
                  className="add-song-btn hov-enlarge"
                  onClick={() => handleAddSong(song)}
                  title={`Add "${song.title}" to playlist "${playlist.title}"`}
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
                Please make sure your words are spelled correctly, or use fewer
                or different keywords.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
