import { playlistService } from "../../services/playlist/playlist.service.js";
import { showErrorMsg, showSuccessMsg } from "../../services/event-bus.service";
import { store } from "../store";
import {
  SET_PLAYLISTS,
  REMOVE_PLAYLIST,
  ADD_PLAYLIST,
  EDIT_PLAYLIST_DETAILS,
  ADD_SONG,
  REMOVE_SONG,
  SET_FILTER,
  SET_IS_LOADING,
  // UNDO_CHANGES, // for rollingback an optimistic update implementation
} from "../reducers/playlist.reducer.js";

// load playlists from backend to the store
export function loadPlaylists() {
  const filterBy = store.getState().playlistModule.filterBy;
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  return playlistService
    .query(filterBy)
    .then((playlists) => {
      store.dispatch({ type: SET_PLAYLISTS, payload: playlists });
    })
    .catch((err) => {
      console.log(
        "Playlist Actions: Having issues with loading playlists:",
        err
      );
      showErrorMsg("Having issues with loading playlists");
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

// remove playlist from backend and update store
export function removePlaylist(playlistId) {
  const lastPlaylists = store.getState().playlistModule.playlists;
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  return playlistService
    .remove(playlistId)
    .then(() => {
      store.dispatch({ type: REMOVE_PLAYLIST, payload: playlistId });
      store.dispatch({ type: SET_IS_LOADING, payload: false });
      showSuccessMsg("Playlist removed");
    })
    .catch((err) => {
      console.log(
        "Playlist Actions: Having issues with removing playlist:",
        err
      );
      showErrorMsg("Having issues with removing playlist");
      //store.dispatch({ type: UNDO_CHANGES, payload: lastPlaylists });
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

// add playlist to backend and update store
export function addPlaylist(playlist) {
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  return playlistService
    .save(playlist)
    .then((savedPlaylist) => {
      store.dispatch({ type: ADD_PLAYLIST, payload: savedPlaylist });
      showSuccessMsg("Playlist added");
      return savedPlaylist;
    })
    .catch((err) => {
      console.log("Playlist Actions: Having issues with adding playlist:", err);
      showErrorMsg("Having issues with adding playlist");
      throw err;
    });
}

// add song to a playlist and update store
export function addSong(playlistId, song) {
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  return playlistService
    .addSong(playlistId, song)
    .then((updatedPlaylist) => {
      store.dispatch({
        type: ADD_SONG,
        payload: {
          playlistId,
          song: updatedPlaylist.songs.find((s) => s._id === song._id),
        },
      });
      showSuccessMsg(
        `Song '${song.title}' successfully added to playlist '${updatedPlaylist.title}'`
      );
    })
    .catch((err) => {
      console.log("Playlist Actions: Having issues with adding song:", err);
      showErrorMsg("Having issues with adding song to playlist");
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

// remove song from a playlist and update store
export function removeSong(playlistId, songId) {
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  return playlistService
    .removeSong(playlistId, songId)
    .then(() => {
      store.dispatch({
        type: REMOVE_SONG,
        payload: { playlistId, songId },
      });
      showSuccessMsg("Song removed from playlist successfully");
    })
    .catch((err) => {
      console.log("Playlist Actions: Having issues with removing song:", err);
      showErrorMsg("Having issues with removing song from playlist");
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

// update playlist details in backend and update store
export function updatePlaylistDetails(playlist) {
  store.dispatch({ type: SET_IS_LOADING, payload: true });
  return playlistService
    .save(playlist)
    .then((savedPlaylist) => {
      store.dispatch({ type: EDIT_PLAYLIST_DETAILS, payload: savedPlaylist });
      showSuccessMsg("Playlist updated successfully");
    })
    .catch((err) => {
      console.log(
        "Playlist Actions: Having issues with updating playlist:",
        err
      );
      showErrorMsg("Having issues with updating playlist");
      throw err;
    })
    .finally(() => {
      store.dispatch({ type: SET_IS_LOADING, payload: false });
    });
}

// update store with filter criteria
export function setFilter(filterBy) {
  return store.dispatch({ type: SET_FILTER, payload: filterBy });
}
