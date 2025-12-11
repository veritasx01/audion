import { storageService } from "../async-storage.service.js";
import {
  getRandomValues,
  getRandomIntInclusive,
  makeId,
  saveToStorage,
  escapeRegexSpecialCharacters,
} from "../util.service.js";
import { faker } from "@faker-js/faker";
import { songs as jsonDemoSongs } from "../../assets/data/songs.js";

export const songService = {
  query,
  getById,
  // remove,
  // add,
  //update,
};

const STORAGE_KEY = "songDB";

_saveDemoSongsToLocalStorage(jsonDemoSongs);

// query playlists from storage with optional filtering by title or description
export function query(filterBy) {
  return storageService
    .query(STORAGE_KEY)
    .then((songs) => {
      if (filterBy?.freeText) {
        let { freeText } = filterBy;
        // Create regex for word boundary matching (case insensitive)
        const regexExpression = new RegExp(
          `\\b${escapeRegexSpecialCharacters(freeText)}\\b`,
          "i"
        );

        songs = songs.filter(
          (song) =>
            regexExpression.test(song.title) ||
            regexExpression.test(song.artist) ||
            regexExpression.test(song.albumName)
        );
      }
      if (filterBy?.genre) {
        const genre = filterBy.genre.toLowerCase();
        songs = songs.filter((song) =>
          song.genres.some((songGenre) => songGenre.toLowerCase() === genre)
        );
      }
      return songs;
    })
    .catch((error) => {
      console.log("Error retrieving songs:", error);
      throw error;
    });
}

export async function getById(songId) {
  song = await storageService.get(STORAGE_KEY, songId);
  return song;
  /*
  return httpService.get(`song/${songId}`);
   */
}

// async function remove(songId) {}

//async function add(song) {}

//async function update(songId) {}

function _saveDemoSongsToLocalStorage(songs) {
  saveToStorage(STORAGE_KEY, songs);
}

export function _createDummySongs(amount = 10) {
  const songs = [];
  const thumbnails = [
    "https://i.scdn.co/image/ab67616d000048515dc62d661568dcaa3b18ce6a",
    "https://i.scdn.co/image/ab67616d00004851ae6d8e36136353d550b2587d",
    "https://i.scdn.co/image/ab67616d000048515074bd0894cb1340b8d8a678",
    "https://i.scdn.co/image/ab67616d00004851926909699c1214051c7a9937",
    "https://i.scdn.co/image/ab67616d00004851aaeb5c9fb6131977995b7f0e",
  ];
  const genres = [
    "Rock",
    "Pop",
    "Jazz",
    "Classical",
    "Hip Hop",
    "Electronic",
    "Reggae",
    "Blues",
    "Country",
    "Funk",
    "Soul",
    "Metal",
    "R&B",
    "Punk",
    "Disco",
    "Folk",
    "Techno",
    "Ska",
    "House",
    "Gospel",
  ];
  for (let i = 0; i < amount; i++) {
    songs.push({
      _id: makeId(),
      title: faker.music.songName(),
      artist: faker.person.fullname,
      duration: getRandomIntInclusive(5, 15),
      albumName: faker.music.album(),
      songThumbnail: getRandomValues(thumbnails, 1)[0],
      releaseDate: new Date(),
      genres: [...getRandomValues(genres, 3)],
    });
  }
  return songs;
}
