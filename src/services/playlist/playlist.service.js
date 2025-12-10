import { storageService } from "../async-storage.service.js";
import { userService } from "../user/user.service.js";
import { httpService } from "../http.service.js";
import { makeId, utilService } from "../util.service.js";
import { faker } from "@faker-js/faker";
import { songs } from "../../assets/data/songs.js";
import defaultThumbnail from "../../assets/images/default-playlist-thumbnail.svg";
import likedSongsThumbnail from "../../assets/images/liked-songs.jpg";

export const playlistService = {
  createPlaylist,
  addSong,
  removeSong,
  getById,
  query,
  save,
  remove,
  createLikedSongsCollectionForUser,
  isLikedSongsPlaylist,
  getLikedSongsPlaylistForUser,
  formatPlaylistDuration,
};

// create a new playlist
function createPlaylist(title = "New Playlist", description = "", songs = []) {
  // add the current date as addedAt for each song
  const playlistSongs = Array.isArray(songs)
    ? songs.map((song) => ({
        ...song,
        addedAt: new Date(),
      }))
    : [];

  const newPlaylist = {
    title,
    description,
    songs: playlistSongs,
    thumbnail: playlistSongs[0]?.thumbnail || _getDefaultThumbnail(),
  };
  return newPlaylist;
}

// add song to a playlist
async function addSong(playlistId, song) {
  const response = await httpService.post(`playlist/${playlistId}/song`, song);
  return response;
}

// remove song from a playlist
async function removeSong(playlistId, songId) {
  const response = await httpService.delete(
    `playlist/${playlistId}/song/${songId}`
  );
  return response;
}

// query playlists from storage with optional filtering by title or description
function query(filterBy = {}, sortBy = "", sortOrder = 1) {
  const queryParams = {};

  // Handle filterBy parameters
  if (filterBy.playlistIds && Array.isArray(filterBy.playlistIds)) {
    queryParams.playlistIds = filterBy.playlistIds.join(",");
  }

  if (filterBy.userId) {
    queryParams.userId = filterBy.userId;
  }
  if (filterBy.isLikedSongs !== undefined) {
    queryParams.isLikedSongs = filterBy.isLikedSongs;
  }

  if (filterBy.freeText) {
    queryParams.q = filterBy.freeText;
  }
  if (filterBy.genre) {
    queryParams.genre = filterBy.genre;
  }

  // Handle sorting parameters
  if (sortBy) {
    queryParams.sortBy = sortBy;
  }
  if (sortOrder !== 1) {
    queryParams.sortDir = sortOrder;
  }

  return httpService.get("playlist", queryParams);
}

// get playlist by id from storage
function getById(id) {
  return httpService.get(`playlist/${id}`);
}

// delete playlist from storage
function remove(id) {
  return httpService.delete(`playlist/${id}`);
}

// save playlist to storage (add new or update existing)
async function save(playlistToSave) {
  var response;
  if (playlistToSave._id) {
    response = await httpService.patch(
      `playlist/${playlistToSave._id}`,
      playlistToSave
    );
  } else {
    response = await httpService.post("playlist", playlistToSave);
  }
  return response;
}

export function createLikedSongsCollectionForUser(user) {
  const likedSongsPlaylist = createPlaylist(
    "Liked Songs",
    "Your collection of liked songs",
    []
  );
  likedSongsPlaylist.thumbnail = likedSongsThumbnail;
  likedSongsPlaylist.isLikedSongs = true; // special flag to identify liked songs playlist
  return likedSongsPlaylist;
}

export function isLikedSongsPlaylist(playlist) {
  return playlist?.isLikedSongs;
}

export async function getLikedSongsPlaylistForUser(userId) {
  if (userId === undefined || userId === null || userId === "")
    return Promise.resolve(null);
  return query({ userId, isLikedSongs: true }).then((playlists) => {
    return playlists.length > 0 ? playlists[0] : null;
  });
}

// util function for formatting total duration of playlist songs
export function formatPlaylistDuration(playlist) {
  const totalDurationSeconds = playlist.songs.reduce(
    (acc, song) => acc + song.duration,
    0
  );
  const hours = Math.floor(totalDurationSeconds / 3600);
  const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
  const seconds = totalDurationSeconds % 60;
  const hoursStr = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""} ` : "";
  const minutesStr = minutes > 0 ? `${minutes} min ` : "";
  const secondsStr = seconds > 0 ? `${seconds} sec` : "";
  return `${hoursStr}${minutesStr}${secondsStr}`.trim();
}

// Get default playlist thumbnail with musical note icon
function _getDefaultThumbnail() {
  return defaultThumbnail;
}
