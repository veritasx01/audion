import { useEffect, useState } from 'react';
import fallbackImage from '../assets/images/black_image.jpg';
import { useExtractColors } from 'react-extract-colors';
import { sortColorsByBrightness } from '../services/util.service';
import {
  pauseIcon,
  playIcon,
  addToCollectionIcon,
  checkmarkIcon,
  editDetailsIcon,
  deleteIcon,
  copyIcon,
} from '../services/icon.service';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSongQueue,
  setPlaylistId,
  setSongQueue,
} from '../store/actions/songQueue.action';
import { setPlaying, togglePlaying } from '../store/actions/song.action';
import { playlistService } from '../services/playlist/playlist.service';
import { useNavigate, generatePath } from 'react-router';
import { ContextMenu, useContextMenu } from './ContextMenu.jsx';
import {
  addPlaylistToLibrary,
  removePlaylistFromLibrary,
} from '../store/actions/userLibrary.action.js';
import { removePlaylist } from '../store/actions/playlist.action.js';
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js';

const DEFAULT_COLOR = '#565656';

export function HomeHeader() {
  const [headerColor, setHeaderColor] = useState(DEFAULT_COLOR);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const loadPlaylists = async () => {
      let playlistsQuery = await playlistService.query();
      playlistsQuery = playlistsQuery.filter((pl) => !pl.isLikedSongs);
      playlistsQuery = playlistsQuery.slice(0, 8);
      setPlaylists(playlistsQuery);
    };
    loadPlaylists();
  }, []);

  return (
    <div className="gradient-header" style={{ backgroundColor: headerColor }}>
      <div className="playlist-card-wrapper">
        <div className="playlist-card-container">
          {/* 2. Map over data */}
          {playlists.map((playlist) => (
            <PlaylistCard
              playlist={playlist}
              key={playlist._id}
              setHeaderColor={setHeaderColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaylistCard({ playlist, setHeaderColor }) {
  const [mainColor, setMainColor] = useState('#fff');
  const { colors } = useExtractColors(playlist.thumbnail);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  useEffect(() => {
    let sortedColors = sortColorsByBrightness(colors, 3);
    setMainColor(sortedColors[0]);
  }, [colors]);

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

  function goToPlaylistPage() {
    // Don't navigate if context menu is visible
    if (contextMenu.isVisible) {
      return;
    }
    if (!playlist._id || playlist._id === '') return;
    navigate(`playlist/${playlist._id}`);
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
      className="playlist-card"
      onClick={goToPlaylistPage}
      onContextMenu={handleRightClick}
      onMouseEnter={() => {
        setHeaderColor(mainColor);
      }}
      onMouseLeave={() => setHeaderColor(DEFAULT_COLOR)}
    >
      <img
        className="playlist-image"
        src={playlist?.thumbnail || fallbackImage}
      ></img>
      <button className="play-button" onClick={handlePlayPause}>
        <span className="play-button-span">
          {playlist._id === playlistId && isPlaying
            ? pauseIcon({ height: '24px', width: '24px', fill: 'black' })
            : playIcon({ height: '24px', width: '24px', fill: 'black' })}
        </span>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <div>
          <a>{playlist.title}</a>
        </div>
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

/*
function playIcon(paused) {
  if (paused) {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7z"></path>
      </svg>
    );
  }
  return (
    <svg className="size-24" viewBox="0 0 24 24" fill="#000">
      <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
    </svg>
  );
}
*/
