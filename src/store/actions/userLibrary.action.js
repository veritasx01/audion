import { playlistService } from "../../services/playlist/playlist.service.js";
import { userService } from "../../services/user/user.service.js";
import {
  showErrorMsg,
  showSuccessMsg,
} from "../../services/event-bus.service.js";
import { store } from "../store.js";
import {
  SET_PLAYLISTS_IN_LIBRARY,
  REMOVE_PLAYLIST_FROM_LIBRARY,
  ADD_PLAYLIST_TO_LIBRARY,
  SET_IS_LOADING,
} from "../reducers/userLibrary.reducer.js";

// load playlists from backend to the store
export function loadLibraryPlaylists(userId) {
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  const userId = userId || userService.getDefaultUser()._id;
  return userService
    .getUserById(userId)
    .then((user) => {
      playlistService
        .query({ playlistIds: user.library?.playlists || [] })
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
      showErrorMsg("Having issues with loading library playlists");
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
      showSuccessMsg("Playlist sucessfully removed from your library");
    })
    .catch((err) => {
      console.log(
        `Playlist Actions: Having issues with removing playlist ${playlistId} from library of user ${userId}:`,
        err
      );
      showErrorMsg("Having issues with removing playlist from library");
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
      showErrorMsg("Having issues with adding playlist to library");
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}
