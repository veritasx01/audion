import { storageService } from "./async-storage.service.js";
import { createDummySongs } from "./song.service.js";
import { getRandomIntInclusive, makeId } from "./util.service";
import { faker } from "@faker-js/faker";

export const playlistService = {
  createPlaylist,
  addSong,
  removeSong,
  getById,
  query,
  save,
  remove,
};

const STORAGE_KEY = "playlistsDB";

// Initialize playlists in storage if not present
_createPlaylists();

// create a new playlist
function createPlaylist(
  title = faker.lorem.words({ min: 2, max: 6 }),
  description = faker.lorem.sentence(),
  createdBy = makeId(),
  createdAt = new Date(),
  songs
) {
  const playlistSongs = songs ?? createDummySongs(getRandomIntInclusive(3, 10));

  // add the current date as addedAt for each song
  playlistSongs.map((song) => ({ ...song, addedAt: new Date() }));

  const newPlaylist = {
    _id: makeId(),
    title: faker.lorem.words({ min: 2, max: 6 }),
    description: faker.lorem.sentence(),
    createdAt: new Date(),
    createdBy: makeId(),
    songs: playlistSongs,
    thumbnail: playlistSongs[0]?.thumbnail,
  };
  return newPlaylist;
}

// add song to a playlist
function addSong(playlistId, song) {
  const newSong = { ...song, addedAt: new Date() };
  return getById(playlistId).then((playlist) => {
    playlist.songs.push(newSong);
    return save(playlist);
  });
}

// remove song from a playlist
function removeSong(playlistId, songId) {
  return getById(playlistId).then((playlist) => {
    playlist.songs = playlist.songs.filter((song) => song._id !== songId);
    return save(playlist);
  });
}

// query playlists from storage with optional filtering by title or description
function query(filterBy) {
  return storageService
    .query(STORAGE_KEY)
    .then((playlists) => {
      if (filterBy) {
        let { title = "", description = "", createdBy = "" } = filterBy;
        playlists = playlists.filter(
          (playlist) =>
            playlist.title.toLowerCase().includes(title.toLowerCase()) &&
            playlist.description
              .toLowerCase()
              .includes(description.toLowerCase()) &&
            playlist.createdBy.toLowerCase().includes(createdBy.toLowerCase())
        );
      }
      return playlists;
    })
    .catch((error) => {
      console.log("Error retrieving playlists:", error);
      throw error;
    });
}

// get playlist by id from storage
function getById(id) {
  return storageService.get(STORAGE_KEY, id);
}

// delete playlist from storage
function remove(id) {
  return storageService.remove(STORAGE_KEY, id);
}

// save playlist to storage (add new or update existing)
function save(playlistToSave) {
  if (playlistToSave.id) {
    return storageService.put(STORAGE_KEY, playlistToSave);
  } else {
    return storageService.post(STORAGE_KEY, playlistToSave);
  }
}

// get playlists from storage or generate dummy data if none exist
function _createPlaylists() {
  let playlists = utilService.loadFromStorage(STORAGE_KEY);
  if (!playlists || !playlists.length) {
    playlists = [];
    for (let i = 0; i < 10; i++) {
      playlists.push(createPlaylist());
    }
    utilService.saveToStorage(STORAGE_KEY, playlists);
  }
  return playlists;
}
