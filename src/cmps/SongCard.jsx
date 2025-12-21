import { useDispatch, useSelector } from 'react-redux';
import {
  pauseIcon,
  playIcon,
  addToCollectionIcon,
  checkmarkIcon,
  editDetailsIcon,
  deleteIcon,
  copyIcon,
} from '../services/icon.service';
import { useNavigate, generatePath } from 'react-router-dom';
import { ContextMenu, useContextMenu } from './ContextMenu.jsx';
import {
  addPlaylistToLibrary,
  removePlaylistFromLibrary,
} from '../store/actions/userLibrary.action.js';
import { removePlaylist } from '../store/actions/playlist.action.js';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js';
import {
  clearSongQueue,
  setPlaylistId,
  setSongQueue,
} from '../store/actions/songQueue.action';
import { setPlaying, togglePlaying } from '../store/actions/song.action';
import { aggregateArtistsFromPlaylist } from '../services/util.service';

export function SongCard({ playlist }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playlistId = useSelector((state) => state.songQueueModule.playlistId);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);
  const likedSongs = useSelector((state) => state.userLibraryModule.likedSongs);
  const libraryPlaylists = useSelector(
    (state) => state.userLibraryModule.playlists
  );
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const userId = likedSongs?.createdBy?._id;
  const isPlaylistOwnedByUser = playlist.createdBy?._id === userId;
  const isPlaylistInLibrary = libraryPlaylists?.some(
    (p) => p._id === playlist._id
  );
  const isPlaylistEditable = isPlaylistOwnedByUser && !playlist.isLikedSongs;

  const handlePlayPause = (e) => {
    e.stopPropagation();
    // If it's already the current playlist (regardless of play state), just toggle
    if (playlist._id !== playlistId) {
      // Load this playlist and start playing
      dispatch(clearSongQueue());
      dispatch(setSongQueue([...playlist.songs]));
      dispatch(setPlaylistId(playlist._id));
      dispatch(setPlaying(true));
    } else {
      dispatch(togglePlaying());
    }
  };

  function goToPlaylistPage(e) {
    // Don't navigate if context menu is visible
    if (contextMenu.isVisible) {
      return;
    }
    if (!playlist._id || playlist._id === '') return;
    navigate(`/playlist/${playlist._id}`);
  }

  function handleRightClick(e) {
    e.preventDefault();
    e.stopPropagation();
    showContextMenu(e, getPlaylistMenuItems());
  }

  async function onSharePlaylistURL() {
    try {
      const playlistPath = generatePath('/playlist/:id', { id: playlist._id });
      const playlistUrl = `${window.location.origin}${playlistPath}`;
      await navigator.clipboard.writeText(playlistUrl);
      showSuccessMsg('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      showErrorMsg('Failed to copy link');
    }
  }

  function onDeletePlaylist() {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      removePlaylist(playlist._id).then(() => {
        navigate('/');
      });
    }
  }

  const getPlaylistMenuItems = () => {
    const menuItems = [];

    // Add playlist to library option if not owned by user and not already in library
    if (!isPlaylistOwnedByUser && !isPlaylistInLibrary) {
      menuItems.push({
        id: 'add-to-library',
        label: 'Add to Your Library',
        icon: addToCollectionIcon({}),
        onClick: () => {
          addPlaylistToLibrary(userId, playlist._id);
          hideContextMenu();
        },
      });
    }

    // Remove playlist from library option if not owned by user and is in library
    if (!isPlaylistOwnedByUser && isPlaylistInLibrary) {
      menuItems.push({
        id: 'remove-from-library',
        label: 'Remove from Your Library',
        icon: checkmarkIcon({ fill: 'var(--text-bright-accent)' }),
        onClick: () => {
          removePlaylistFromLibrary(userId, playlist._id);
          hideContextMenu();
        },
      });
    }

    // Edit and Delete options if playlist is editable
    if (isPlaylistEditable) {
      menuItems.push({
        id: 'edit',
        label: 'Edit details',
        icon: editDetailsIcon({}),
        onClick: () => {
          navigate(`/playlist/${playlist._id}?edit=true`);
          hideContextMenu();
        },
      });
      menuItems.push({
        id: 'delete',
        label: 'Delete',
        icon: deleteIcon({}),
        danger: true,
        onClick: () => {
          onDeletePlaylist();
          hideContextMenu();
        },
      });
    }

    if (menuItems.length > 0) menuItems.push({ type: 'separator' });

    menuItems.push({
      id: 'share',
      label: 'Copy link to playlist',
      icon: copyIcon({}),
      onClick: () => {
        onSharePlaylistURL();
        hideContextMenu();
      },
    });

    return menuItems;
  };

  return (
    <div
      className="song-card"
      onClick={goToPlaylistPage}
      onContextMenu={handleRightClick}
    >
      <button className="play-button-carousel" onClick={handlePlayPause}>
        <span className="size-48">
          {playlistId === playlist._id && isPlaying
            ? pauseIcon({ height: '24px', width: '24px', fill: 'black' })
            : playIcon({ height: '24px', width: '24px', fill: 'black' })}
        </span>
      </button>
      <div style={{ width: '100%' }}>
        <img src={playlist?.thumbnail} alt={playlist?.title} />
        {playlist?.title ? (
          <p className="card-title">{playlist?.title}</p>
        ) : null}
        <p className="card-artist">{aggregateArtistsFromPlaylist(playlist)}</p>
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
