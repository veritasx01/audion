import { playlistService } from '../../services/playlist/playlist.service.js';
import { userService } from '../../services/user/user.service.js';
import {
  showErrorMsg,
  showSuccessMsg,
} from '../../services/event-bus.service.js';
import { store } from '../store.js';
import {
  SET_IS_LOADING,
  ADD_PLAYLIST_TO_LIBRARY,
  REMOVE_PLAYLIST_FROM_LIBRARY,
  SET_PLAYLISTS_IN_LIBRARY,
  ADD_SONG_TO_LIKED_SONGS,
  REMOVE_SONG_FROM_LIKED_SONGS,
} from '../reducers/userLibrary.reducer.js';

// load playlists from backend to the store
export async function loadLibraryPlaylists(userId) {
  const defaultUser = await userService.getDefaultUser();
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  var userId = userId || defaultUser._id;
  return userService
    .getUserById(userId)
    .then((user) => {
      playlistService
        .query({
          playlistIds: user.library?.playlists || [],
          includeLikedSongs: true,
        })
        .then((userLibraryPlaylists) => {
          store.dispatch({
            type: SET_PLAYLISTS_IN_LIBRARY,
            payload: userLibraryPlaylists,
          });
        });
    })
    .catch((err) => {
      console.log(
        `Playlist Actions: Having issues with loading playlists for user ${userId}:`,
        err
      );
      showErrorMsg('Having issues with loading library playlists');
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

export function removePlaylistFromLibrary(userId, playlistId) {
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  return userService
    .removePlaylistFromUserLibrary(userId, playlistId) // remove on backend DB
    .then(() => {
      store.dispatch({
        type: REMOVE_PLAYLIST_FROM_LIBRARY, // remove from store
        payload: playlistId,
      });
      showSuccessMsg('Playlist sucessfully removed from your library');
    })
    .catch((err) => {
      console.log(
        `Playlist Actions: Having issues with removing playlist ${playlistId} from library of user ${userId}:`,
        err
      );
      showErrorMsg('Having issues with removing playlist from library');
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

export function addPlaylistToLibrary(userId, playlistId) {
  store.dispatch({ type: SET_IS_LOADING, payload: false });
  return userService
    .addPlaylistToUserLibrary(userId, playlistId) // add on backend DB
    .then(() => {
      return playlistService.getById(playlistId).then((playlist) => {
        store.dispatch({
          type: ADD_PLAYLIST_TO_LIBRARY, // add playlist to library store
          payload: playlist,
        });
        showSuccessMsg(
          `Playlist "${playlist.title}" successfully added to your library`
        );
      });
    })
    .catch((err) => {
      console.log(
        `Playlist Actions: Having issues with adding playlist ${playlistId} to library of user ${userId}:`,
        err
      );
      showErrorMsg('Having issues with adding playlist to library');
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

// add song to liked songs collection in user library
export function addSongToLikedSongs(userId, song) {
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  return playlistService
    .getLikedSongsPlaylistForUser(userId)
    .then((likedSongsPlaylist) => {
      if (likedSongsPlaylist.songs.some((s) => s._id === song._id)) {
        showSuccessMsg(`Song '${song.title}' is already in Liked Songs`);
        return;
      }
      return playlistService
        .addSong(likedSongsPlaylist._id, song)
        .then((updatedPlaylist) => {
          store.dispatch({
            type: ADD_SONG_TO_LIKED_SONGS,
            payload: song,
          });
          showSuccessMsg(`Song '${song.title}' Added to Liked Songs`);
        });
    })
    .catch((err) => {
      console.log(
        `User Library Actions: Having issues with adding song ${song.title} to liked songs for user ${userId}:`,
        err
      );
      showErrorMsg(
        `Error occurred while adding song ${song.title} to Liked Songs`
      );
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

// remove song from liked songs collection in user library
export function removeSongFromLikedSongs(userId, songId) {
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  return playlistService
    .getLikedSongsPlaylistForUser(userId)
    .then((likedSongsPlaylist) => {
      playlistService.removeSong(likedSongsPlaylist._id, songId).then(() => {
        store.dispatch({
          type: REMOVE_SONG_FROM_LIKED_SONGS,
          payload: songId,
        });
        showSuccessMsg(`Song successfully removed from Liked Songs`);
      });
    })
    .catch((err) => {
      console.log(
        `User Library Actions: Having issues with removing song ${songId} from liked songs for user ${userId}:`,
        err
      );
      showErrorMsg(`Error occurred while removing song from Liked Songs`);
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}
