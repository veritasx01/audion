import { useSelector } from 'react-redux';
import { formatTimeFromSecs } from '../services/util.service';
import {
  meatBallMenuIcon,
  pauseIcon,
  playIcon,
  addToCollectionIcon,
  checkmarkIcon,
  addIcon,
} from '../services/icon.service';
import { useSongController } from '../customHooks/useSongController';
import {
  addSongToLikedSongs,
  removeSongFromLikedSongs,
} from '../store/actions/userLibrary.action.js';
import { addSong } from '../store/actions/playlist.action.js';
import { loadLibraryPlaylists } from '../store/actions/userLibrary.action.js';
import {
  ContextMenu,
  useContextMenu,
  calculateMenuPosition,
} from './ContextMenu.jsx';

export function SongResultCard({ song }) {
  const likedSongs = useSelector((state) => state.userLibraryModule.likedSongs);
  const libraryPlaylists = useSelector(
    (state) => state.userLibraryModule.playlists
  );
  const isSongInLibrary = likedSongs?.songs?.some((s) => s._id === song._id);
  const userId = likedSongs?.createdBy?._id;
  const { isCurrentSongPlaying, toggleSong } = useSongController(song);
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  // Filter playlists where this song is not already added
  const availablePlaylists =
    libraryPlaylists?.filter(
      (pl) => !pl.songs?.some((s) => s._id === song._id) && pl.createdBy?._id === userId
    ) || [];

  const onAddOrRemoveLikedSong = (userId, song, isSongInLibrary) => {
    if (!isSongInLibrary) {
      addSongToLikedSongs(userId, song);
    } else {
      removeSongFromLikedSongs(userId, song._id);
    }
  };

  function handleRightClick(e) {
    e.preventDefault();
    showSongContextMenu(e);
  }

  function handleMeatballClick(e) {
    e.preventDefault();
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const { menuX, menuY } = calculateMenuPosition(buttonRect);

    const modifiedEvent = {
      ...e,
      clientX: menuX,
      clientY: menuY,
    };

    showSongContextMenu(modifiedEvent);
  }

  function showSongContextMenu(e) {
    const libraryMenuItem = {
      id: isSongInLibrary ? 'remove-from-liked-songs' : 'add-to-liked-songs',
      label: isSongInLibrary
        ? 'Remove from your Liked Songs'
        : 'Save to your Liked Songs',
      icon: isSongInLibrary
        ? checkmarkIcon({ fill: 'var(--text-bright-accent)' })
        : addToCollectionIcon({}),
      onClick: () => {
        onAddOrRemoveLikedSong(userId, song, isSongInLibrary);
        hideContextMenu();
      },
    };

    const songMenuItems = [
      {
        id: 'add-to-playlist',
        label: 'Add to playlist',
        icon: addIcon({}),
        submenu:
          availablePlaylists.length > 0
            ? availablePlaylists.map((playlist) => {
                return {
                  id: `playlist-${playlist._id}`,
                  label: playlist.title,
                  onClick: () => {
                    addSong(playlist._id, song).then(() => {
                      loadLibraryPlaylists();
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
      { type: 'separator' },
      libraryMenuItem,
    ];

    showContextMenu(e, songMenuItems);
  }

  return (
    <div className="result-song-list-item" onContextMenu={handleRightClick}>
      <div className="flex" style={{ width: '100%' }}>
        <div className="search-card-thumbnail-container">
          <img className="song-result-card-image" src={song?.thumbnail}></img>
          <button className="search-card-play-btn" onClick={toggleSong}>
            {isCurrentSongPlaying ? pauseIcon({}) : playIcon({})}
          </button>
        </div>
        <div className="song-result-card-text">
          <a className="song-result-card-title">{song?.title}</a>
          <a className="song-result-card-artist">{song?.artist}</a>
        </div>
      </div>
      <div className="song-result-options">
        <button
          className={`add-button hov-enlarge ${
            isSongInLibrary ? 'active' : ''
          }`}
          style={{ marginRight: '16px' }}
          onClick={() => onAddOrRemoveLikedSong(userId, song, isSongInLibrary)}
        >
          <span className="size-16">
            {isSongInLibrary
              ? checkmarkIcon({ height: '16px', width: '16px' })
              : addToCollectionIcon({
                  height: '16px',
                  width: '16px',
                  fill: '#b0b0b0',
                })}
          </span>
        </button>
        <p>{formatTimeFromSecs(song?.duration)}</p>
        <button
          className={`song-result-meatball-button hov-enlarge`}
          onClick={handleMeatballClick}
        >
          <span className="size-24">{meatBallMenuIcon({})}</span>
        </button>
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
