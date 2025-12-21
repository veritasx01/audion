import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { addSong } from '../store/actions/playlist.action.js';
import { loadLibraryPlaylists } from '../store/actions/userLibrary.action.js';
import {
  addSongToLikedSongs,
  removeSongFromLikedSongs,
} from '../store/actions/userLibrary.action.js';
import {
  searchIcon,
  clearIcon,
  addIcon,
  addToCollectionIcon,
  checkmarkIcon,
} from '../services/icon.service.jsx';
import { songService } from '../services/song/song.service.js';
import { formatTimeFromSecs } from '../services/util.service.js';
import { useDebounce } from '../customHooks/useDebounce.js';
import { SmallSearchSkelletonLoader } from './SmallSearchSkelletonLoader.jsx';
import { ContextMenu, useContextMenu } from './ContextMenu.jsx';

export function PlaylistSongSearch({ playlist, loadPlaylist, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const likedSongs = useSelector((state) => state.userLibraryModule.likedSongs);
  const libraryPlaylists = useSelector(
    (state) => state.userLibraryModule.playlists
  );
  const userId = likedSongs?.createdBy?._id;
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

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
        console.error('Error searching songs:', error);
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
      loadLibraryPlaylists();
      // Don't clear search to allow adding multiple songs
    } catch (error) {
      console.error('Error adding song to playlist:', error);
    }
  };

  const isSongInLibrary = (songId) => {
    return likedSongs?.songs?.some((s) => s._id === songId);
  };

  const onAddOrRemoveLikedSong = (song) => {
    const isInLibrary = isSongInLibrary(song._id);
    if (!isInLibrary) {
      addSongToLikedSongs(userId, song);
    } else {
      removeSongFromLikedSongs(userId, song._id);
    }
  };

  const handleRightClick = (e, song) => {
    e.preventDefault();
    showSongContextMenu(e, song);
  };

  const showSongContextMenu = (e, song) => {
    const isInLibrary = isSongInLibrary(song._id);

    // Filter playlists where this song is not already added
    const availablePlaylists =
      libraryPlaylists?.filter(
        (pl) =>
          !pl.songs?.some((s) => s._id === song._id) &&
          pl.createdBy?._id === userId
      ) || [];

    const libraryMenuItem = {
      id: isInLibrary ? 'remove-from-liked-songs' : 'add-to-liked-songs',
      label: isInLibrary
        ? 'Remove from your Liked Songs'
        : 'Save to your Liked Songs',
      icon: isInLibrary
        ? checkmarkIcon({ fill: 'var(--text-bright-accent)' })
        : addToCollectionIcon({}),
      onClick: () => {
        onAddOrRemoveLikedSong(song);
        hideContextMenu();
      },
    };

    const songMenuItems = [
      {
        id: 'add-to-current-playlist',
        label: `Add to ${playlist.title}`,
        icon: addIcon({}),
        onClick: () => {
          handleAddSong(song);
          hideContextMenu();
        },
      },
      {
        id: 'add-to-playlist',
        label: 'Add to other playlist',
        icon: addIcon({}),
        submenu:
          availablePlaylists.length > 0
            ? availablePlaylists.map((otherPlaylist) => {
                return {
                  id: `playlist-${otherPlaylist._id}`,
                  label: otherPlaylist.title,
                  onClick: () => {
                    addSong(otherPlaylist._id, song).then(() => {
                      loadLibraryPlaylists();
                    });
                    hideContextMenu();
                  },
                };
              })
            : [
                {
                  id: 'no-other-playlists-available',
                  label: 'No other playlists available',
                  disabled: true,
                },
              ],
      },
      { type: 'separator' },
      libraryMenuItem,
    ];

    showContextMenu(e, songMenuItems);
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
                setSearchQuery('');
                setDebouncedSearchQuery('');
              }}
              title="Clear search"
            >
              {clearIcon({
                height: 16,
                width: 16,
                fill: 'var(--text-base)',
              })}
            </button>
          )}
        </div>
        <button
          className="close-search-btn"
          onClick={() => {
            onClose();
            setSearchQuery('');
            setDebouncedSearchQuery('');
          }}
          title="Close search"
        >
          {clearIcon({ height: 24, width: 24, fill: 'var(--text-subdued)' })}
        </button>
      </div>

      <div className="search-results">
        {searchQuery && filteredSongs.length > 0 ? (
          <ul className="results-list">
            {filteredSongs.map((song) => (
              <li
                key={song._id}
                className="search-result-item"
                onContextMenu={(e) => handleRightClick(e, song)}
              >
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
        ) : isLoading ? (
          <SmallSearchSkelletonLoader></SmallSearchSkelletonLoader>
        ) : (
          searchQuery &&
          debouncedSearchQuery && (
            <div className="no-results">
              <h3>{`No results found for "${debouncedSearchQuery}"`}</h3>
              <p>
                Please make sure your words are spelled correctly, or use fewer
                or different keywords.
              </p>
            </div>
          )
        )}
      </div>

      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        onClose={hideContextMenu}
        menuItems={contextMenu.items}
      />
    </div>
  );
}
