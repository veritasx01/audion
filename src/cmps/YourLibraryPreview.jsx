import { useState } from 'react';
import { Link, useNavigate, useLocation, generatePath } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ContextMenu, useContextMenu } from './ContextMenu.jsx';
import { userService } from '../services/user/user.service.js';
import { playlistService } from '../services/playlist/playlist.service.js';
import {
  addPlaylist,
  removePlaylist,
} from '../store/actions/playlist.action.js';
import {
  addPlaylistToLibrary,
  removePlaylistFromLibrary,
  loadLibraryPlaylists,
} from '../store/actions/userLibrary.action.js';
import { setPlaying, togglePlaying } from '../store/actions/song.action';
import {
  clearSongQueue,
  setPlaylistId,
  setSongQueue,
  toggleShuffle,
} from '../store/actions/songQueue.action.js';
import {
  playIcon,
  pauseIcon,
  fullSpeakerIcon,
  addToQueueIcon,
  editDetailsIcon,
  deleteIcon,
  createPlaylistIcon,
  copyIcon,
  checkmarkIcon,
} from '../services/icon.service.jsx';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js';

export function YourLibraryPreview({
  _id,
  title,
  type: itemType, // playlist, artist, album, etc.
  createdBy,
  thumbnail,
  songs,
  isCollapsed,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isNowPlaying = useSelector((state) => state.songModule.isPlaying);
  const queueState = useSelector((state) => state.songQueueModule);
  const likedSongs = useSelector((state) => state.userLibraryModule.likedSongs);
  const libraryPlaylists = useSelector(
    (store) => store.userLibraryModule.playlists
  );
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const isCurrentPlaylist = queueState?.playlistId === _id;
  const isCurrentlyPlaying = isNowPlaying && isCurrentPlaylist;

  function handlePlayPause() {
    if (songs.length === 0) {
      showErrorMsg('The playlist you are trying to play is empty.');
      return;
    }
    if (!isCurrentPlaylist) {
      dispatch(clearSongQueue());
      dispatch(setSongQueue([...songs]));
      dispatch(setPlaylistId(_id));
      dispatch(setPlaying(true));
    } else {
      dispatch(togglePlaying());
    }
  }

  async function onSharePlaylistURL() {
    try {
      // Generate URL for this specific playlist
      const playlistPath = generatePath('/playlist/:id', { id: _id });
      const playlistUrl = `${window.location.origin}${playlistPath}`;

      await navigator.clipboard.writeText(playlistUrl);
      showSuccessMsg('Link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy URL: ', err);
      showErrorMsg('Failed to copy link');
    }
  }

  function handleOnCreatePlaylist() {
    // (1) create playlist object in-memory
    const newPlaylist = playlistService.createPlaylist(
      `My Playlist #${libraryPlaylists.length + 1}`
    );
    // (2) Save the playlist on backend storage & add it playlist store
    addPlaylist(newPlaylist)
      .then((savedPlaylist) => {
        // (3) add the new playlist to user's library on backend & in store
        return addPlaylistToLibrary(
          savedPlaylist.createdBy?._id,
          savedPlaylist._id
        ).then(() => savedPlaylist); // Return the savedPlaylist for the next chain
      })
      .then((savedPlaylist) => {
        // (4) navigate to the new playlist's page
        navigate(`/playlist/${savedPlaylist._id}`);
      })
      .catch((err) => {
        console.error('Error creating playlist:', err);
        showErrorMsg('Failed to create playlist');
      });
  }

  function handleContextMenu(ev) {
    showContextMenu(ev, getContextMenuItems());
  }

  function getContextMenuItems() {
    const menuItems = [];
    const userId = likedSongs?.createdBy._id;
    const isPlaylistEditable =
      likedSongs._id !== _id && createdBy._id === userId; // not liked songs and created by current user

    if (_id !== likedSongs._id) {
      menuItems.push({
        id: 'remove-from-library',
        label: 'Remove from Your Library',
        icon: checkmarkIcon({ fill: 'var(--text-bright-accent)' }),
        onClick: () => removePlaylistFromLibrary(userId, _id),
      });
    }

    // add to queue
    menuItems.push({
      id: 'add-to-queue',
      label: 'Add to queue',
      icon: addToQueueIcon({}),
      disabled: true, // TODO: enable when queue merging is implemented
      onClick: () => {
        // TBD: handle adding to queue without intefering play of current song
        dispatch(setSongQueue([...queueState.songQueue, ...songs]));
        // dispatch(setPlaylistId(_id));
      },
    });

    menuItems.push({ type: 'separator' });

    if (isPlaylistEditable) {
      // edit playlist details
      menuItems.push({
        id: 'edit-details',
        label: 'Edit details',
        icon: editDetailsIcon({}),
        disabled: false,
        onClick: () => {
          navigate(`/playlist/${_id}?edit=true`);
          hideContextMenu();
        },
      });

      // delete playlist
      menuItems.push({
        id: 'delete',
        label: 'Delete playlist',
        icon: deleteIcon({}),
        danger: true,
        onClick: () => {
          const isCurrentlyViewingThisPlaylist =
            location.pathname === `/Playlist/${_id}`;
          removePlaylist(_id);
          removePlaylistFromLibrary(userId, _id);

          // Navigate to home if currently viewing the deleted playlist
          if (isCurrentlyViewingThisPlaylist) {
            navigate('/');
          }
        },
      });

      menuItems.push({ type: 'separator' });
    }

    // create new playlist
    menuItems.push({
      id: 'create',
      label: 'Create playlist',
      icon: createPlaylistIcon({}),
      onClick: () => {
        handleOnCreatePlaylist();
      },
    });
    menuItems.push({ type: 'separator' });

    // share playlist link
    menuItems.push({
      id: 'share',
      label: 'Copy link to playlist',
      icon: copyIcon({}),
      onClick: onSharePlaylistURL,
    });
    return menuItems;
  }

  return (
    <div
      className={`your-library-preview${isCollapsed ? ' collapsed' : ''}`}
      onContextMenu={handleContextMenu}
    >
      <Link to={`/${itemType}/${_id}`} className="your-library-preview-link">
        <div className="your-library-thumbnail-container">
          <img
            src={thumbnail}
            alt={`${title} thumbnail`}
            className={`your-library-thumbnail${
              isCollapsed ? ' collapsed' : ''
            }`}
          />
          {!isCollapsed && itemType === 'Playlist' && (
            <button
              className="your-library-play-btn"
              onClick={handlePlayPause}
              title={`${isCurrentlyPlaying ? 'Pause' : 'Play'} ${title}`}
            >
              {isCurrentlyPlaying ? pauseIcon({}) : playIcon({})}
            </button>
          )}
        </div>
        {!isCollapsed && (
          <div className="your-library-info">
            <h4
              className={`your-library-title ${
                isCurrentPlaylist ? 'current-playlist' : ''
              }`}
            >
              {title}
            </h4>
            <p className="your-library-meta">
              {itemType} • {createdBy.fullName}
            </p>
          </div>
        )}
        {!isCollapsed && isCurrentlyPlaying && (
          <div className="speaker-icon">
            {fullSpeakerIcon({
              width: 14,
              height: 14,
              fill: 'var(--text-bright-accent)',
            })}
          </div>
        )}
      </Link>

      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        onClose={hideContextMenu}
        menuItems={contextMenu.items}
        className="library-context-menu"
      />
    </div>
  );
}
