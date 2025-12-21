import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPlaying, togglePlaying } from '../store/actions/song.action';
import { addSong, removeSong } from '../store/actions/playlist.action.js';
import {
  addSongToLikedSongs,
  removeSongFromLikedSongs,
} from '../store/actions/userLibrary.action.js';
import {
  ContextMenu,
  useContextMenu,
  calculateMenuPosition,
} from './ContextMenu.jsx';
import {
  playIcon,
  pauseIcon,
  durationIcon,
  checkmarkIcon,
  meatBallMenuIcon as moreOptionsIcon,
  addIcon,
  removeIcon,
  addToCollectionIcon,
  nowPlayingBarChartIcon,
} from '../services/icon.service.jsx';
import {
  clearSongQueue,
  seekSongQueueIndex,
  setPlaylistId,
  setSongQueue,
} from '../store/actions/songQueue.action.js';
import {
  formatTimeFromSecs,
  formatRelativeTime,
} from '../services/util.service.js';

export function PlaylistDetailsTable({ playlist, loadPlaylist }) {
  const dispatch = useDispatch();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [focusedRow, setFocusedRow] = useState(null);
  const isPlaying = useSelector((store) => store.songModule.isPlaying);
  const playingSongId = useSelector(
    (store) => store.songModule.currentSong._id
  );
  const playingPlaylistId = useSelector(
    (store) => store.songQueueModule.playlistId
  );
  const libraryPlaylists = useSelector(
    (store) => store.userLibraryModule.playlists
  );
  const likedSongsCollection = useSelector(
    (store) => store.userLibraryModule.likedSongs
  );
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const otherPlaylists = useMemo(
    () =>
      libraryPlaylists
        .filter((pl) => pl._id !== playlist._id)
        .map((pl) => ({
          _id: pl._id,
          title: pl.title,
          songs: pl.songs || [],
          userId: pl.createdBy?._id,
        })),
    [libraryPlaylists, playlist._id]
  );

  // Library playlists are managed by other components and updated via store actions

  // Clear focused row when context menu closes
  useEffect(() => {
    if (!contextMenu.isVisible) {
      setFocusedRow(null);
    }
  }, [contextMenu.isVisible]);

  // Handle clicks outside table to clear focus
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Clear focus if clicking outside the table wrapper
      if (!e.target.closest('.playlist-table-wrapper')) {
        setFocusedRow(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  function handlePlayPause(song, index) {
    if (playingPlaylistId !== playlist._id) {
      dispatch(clearSongQueue());
      dispatch(setSongQueue([...playlist.songs]));
      dispatch(setPlaylistId(playlist._id));
      dispatch(setPlaying(true));
    }
    const lastId = song._id;
    dispatch(seekSongQueueIndex(index));
    if (lastId !== playingSongId) {
      dispatch(setPlaying(true));
    } else {
      dispatch(togglePlaying());
    }
  }

  function isSongInLikedSongs(songId) {
    return likedSongsCollection?.songs?.some((s) => s._id === songId);
  }

  function onAddSongToLikedSongs(song) {
    addSongToLikedSongs(likedSongsCollection.createdBy?._id, song);
  }
  function onRemoveSongFromLikedSongs(song) {
    removeSongFromLikedSongs(likedSongsCollection.createdBy._id, song._id);

    // If currently viewing Liked Songs playlist, refresh it on playlist details view as well
    if (playlist._id === likedSongsCollection._id) {
      loadPlaylist();
    }
  }

  function handleOnSongMoreOptionsClick(e, song) {
    e.preventDefault();
    const buttonRect = e.currentTarget.getBoundingClientRect(); // Get the button's position

    const { menuX, menuY } = calculateMenuPosition(buttonRect);

    const modifiedEvent = {
      ...e,
      clientX: menuX,
      clientY: menuY,
    };

    // construct relevant playlists that the selected song could be added to, for displaying them in submenu. Exclude playlists that already contain the song
    const availablePlaylists = otherPlaylists.filter(
      (pl) =>
        !pl.songs?.some((s) => s._id === song._id) &&
        pl.userId === likedSongsCollection.createdBy?._id
    );

    // Create menu items specific to the selected song
    let libraryMenuItem;

    if (isSongInLikedSongs(song._id)) {
      libraryMenuItem = {
        id: 'remove-from-liked-songs',
        label: 'Remove from your Liked Songs',
        icon: checkmarkIcon({ fill: 'var(--text-bright-accent)' }),
        onClick: () => {
          onRemoveSongFromLikedSongs(song);
          hideContextMenu();
        },
      };
    } else {
      libraryMenuItem = {
        id: 'add-to-liked-songs',
        label: 'Save to your Liked Songs',
        icon: addToCollectionIcon({}),
        onClick: () => {
          onAddSongToLikedSongs(song);
          hideContextMenu();
        },
      };
    }

    const songMenuItems = [
      {
        id: 'add-to-playlist',
        label: 'Add to playlist',
        icon: addIcon({}),
        submenu:
          availablePlaylists.length > 0
            ? availablePlaylists.map((otherPlaylist) => {
                return {
                  id: `playlist-${otherPlaylist._id}`,
                  label: otherPlaylist.title,
                  onClick: () => {
                    addSong(otherPlaylist._id, song).then(() => {
                      loadPlaylist();
                    });
                    hideContextMenu();
                  },
                };
              })
            : [
                {
                  id: 'no-playlists-available',
                  label: 'No relevant playlists found',
                  disabled: true,
                },
              ],
      },
      {
        id: 'remove-from-playlist',
        label: 'Remove from this playlist',
        icon: removeIcon({}),
        onClick: () => {
          removeSong(playlist._id, song._id).then(() => loadPlaylist());
          hideContextMenu();
        },
        disabled:
          playlist.createdBy?._id !== likedSongsCollection.createdBy?._id,
      },
      { type: 'separator' },

      libraryMenuItem,
    ];

    showContextMenu(modifiedEvent, songMenuItems);
  }

  if (!playlist.songs || playlist.songs.length === 0) {
    return;
  }

  return (
    <div className="playlist-table-wrapper">
      <table className="playlist-table">
        <thead>
          <tr>
            <th className="song-number-col">#</th>
            <th className="playlist-song-title">Title</th>
            <th className="playlist-song-album">Album</th>
            <th className="playlist-song-date-added">Date Added</th>
            <th className="playlist-song-add-action"></th>
            <th className="playlist-song-duration" title="Duration">
              {durationIcon({})}
            </th>
            <th className="playlist-song-actions"></th>
          </tr>
        </thead>
        <tbody>
          {playlist.songs.map((song, idx) => (
            <tr
              key={song._id || idx}
              className={`${hoveredRow === idx ? 'hovered' : ''} ${
                focusedRow === idx ? 'focused' : ''
              }`.trim()}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => {
                setFocusedRow(idx);
              }}
            >
              <td className={'song-number-col'} key="num">
                {hoveredRow === idx ? (
                  playingPlaylistId === playlist._id &&
                  playingSongId === song._id &&
                  isPlaying ? (
                    <button
                      className="song-play-pause-btn"
                      onClick={() => handlePlayPause(song, idx)}
                      title="Pause"
                    >
                      {pauseIcon({})}
                    </button>
                  ) : (
                    <button
                      className="song-play-pause-btn"
                      onClick={() => handlePlayPause(song, idx)}
                      title="Play"
                    >
                      {playIcon({})}
                    </button>
                  )
                ) : playingPlaylistId === playlist._id &&
                  playingSongId === song._id &&
                  isPlaying ? (
                  <span className="now-playing-animation" title="Now Playing">
                    {nowPlayingBarChartIcon({})}
                  </span>
                ) : (
                  <span
                    className={`song-number-col ${
                      playingPlaylistId === playlist._id &&
                      playingSongId === song._id
                        ? 'active'
                        : ''
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
              </td>
              <td className="playlist-song-title" key="title">
                <div className="playlist-title-content">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="playlist-song-thumb"
                  />
                  <div className="playlist-song-text">
                    <span
                      className={`playlist-song-title ${
                        playingPlaylistId === playlist._id &&
                        playingSongId === song._id
                          ? 'active'
                          : ''
                      }`}
                    >
                      {song.title}
                    </span>
                    <span className="playlist-song-artist">{song.artist}</span>
                  </div>
                </div>
              </td>
              <td key="album">
                <div className="playlist-song-album">{song.albumName}</div>
              </td>
              <td key="dateAdded">
                <div className="playlist-song-date-added">
                  {song.addedAt ? formatRelativeTime(song.addedAt) : ''}
                </div>
              </td>

              <td className="playlist-song-add-action" key="add-action">
                <button
                  className={`add-btn ${
                    isSongInLikedSongs(song._id) ? 'liked' : ''
                  }`}
                  title={
                    !isSongInLikedSongs(song._id)
                      ? 'Save to your Liked Songs'
                      : 'Remove from your Liked Songs'
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setFocusedRow(idx);
                    if (!isSongInLikedSongs(song._id)) {
                      onAddSongToLikedSongs(song);
                    } else {
                      onRemoveSongFromLikedSongs(song);
                    }
                  }}
                >
                  {!isSongInLikedSongs(song._id)
                    ? addToCollectionIcon({})
                    : checkmarkIcon({})}
                </button>
              </td>
              <td className="playlist-song-duration" key="duration">
                {song.duration ? formatTimeFromSecs(song.duration) : ''}
              </td>
              <td className="playlist-table-actions" key="actions">
                <div className="playlist-row-actions">
                  <button
                    className="menu-btn"
                    title={`More options for ${song.title} by ${song.artist}`}
                    onClick={(e) => {
                      setFocusedRow(idx);
                      handleOnSongMoreOptionsClick(e, song);
                    }}
                  >
                    {moreOptionsIcon({ height: 28, width: 28 })}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
