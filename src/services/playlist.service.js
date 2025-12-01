import { storageService } from "./async-storage.service.js";
import { createDummySongs } from "./song.service.js";
import { utilService } from "./util.service";
import { faker } from "@faker-js/faker";
import { songs } from "../assets/data/songs.js";
import defaultThumbnail from "../assets/images/default-playlist-thumbnail.svg";

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
  createdBy = faker.person.fullName(),
  createdAt = new Date(),
  songs = []
) {
  // add the current date as addedAt for each song
  const playlistSongs = songs.map((song) => ({ ...song, addedAt: new Date() }));

  // Use first song's thumbnail if available, otherwise use default musical note thumbnail
  const thumbnail = playlistSongs[0]?.thumbnail || _getDefaultThumbnail();

  const newPlaylist = {
    //_id: utilService.makeId(), // would be added by backend service
    title,
    description,
    createdBy,
    createdAt,
    songs: playlistSongs,
    thumbnail,
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
  if (playlistToSave._id) {
    return storageService.put(STORAGE_KEY, playlistToSave);
  } else {
    return storageService.post(STORAGE_KEY, playlistToSave);
  }
}

// Get default playlist thumbnail with musical note icon
function _getDefaultThumbnail() {
  return defaultThumbnail;
}

// get playlists from storage or generate dummy data if none exist
function _createPlaylists() {
  let playlists = utilService.loadFromStorage(STORAGE_KEY);
  if (!playlists || !playlists.length) {
    playlists = [];
    const rockSongs = songs.filter((song) => song.genres.includes("rock"));
    const popSongs = songs.filter((song) => song.genres.includes("pop"));
    const jazzSongs = songs.filter((song) => song.genres.includes("jazz"));
    const bluesSongs = songs.filter((song) => song.genres.includes("blues"));
    const beatlesSongs = songs.filter((s) => s.artist.includes("Beatles"));
    const psychedelicRockSongs = songs.filter(
      (s) => s.genres.includes("rock") && s.genres.includes("psychedelic")
    );

    playlists.push(
      createPlaylist(
        "Rock Classics",
        "Best of rock music",
        "user1",
        new Date(),
        rockSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    playlists.push(
      createPlaylist(
        "Pop Hits",
        "Top pop songs",
        "user2",
        new Date(),
        popSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );
    playlists.push(
      createPlaylist(
        "Jazz Vibes",
        "Smooth jazz tunes",
        "user3",
        new Date(),
        jazzSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    playlists.push(
      createPlaylist(
        "Blues Essentials",
        "Classic blues tracks",
        "user4",
        new Date(),
        bluesSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    playlists.push(
      createPlaylist(
        "The Beatles Collection",
        "Hits from The Beatles and solo works",
        "SYSTEM",
        new Date(),
        beatlesSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    playlists.push(
      createPlaylist(
        "Psychedelic Rock",
        "Trippy and mind-bending rock tunes",
        "SYSTEM",
        new Date(),
        psychedelicRockSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    utilService.saveToStorage(STORAGE_KEY, playlists);
  }
  return playlists;
}
