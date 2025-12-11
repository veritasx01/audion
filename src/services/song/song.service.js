import { storageService } from "../async-storage.service.js";
import {
  getRandomValues,
  getRandomIntInclusive,
  makeId,
  saveToStorage,
  escapeRegexSpecialCharacters,
} from "../util.service.js";

export const songService = {
  query,
  getById,
  // remove,
  // add,
  //update,
};

const STORAGE_KEY = "songDB";

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
