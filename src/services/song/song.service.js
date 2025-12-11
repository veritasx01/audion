import { httpService } from "../http.service.js";

export const songService = {
  query,
  getById,
  remove,
  add,
  update,
};

// query playlists from storage with optional filtering by title or description
export async function query(filterBy = {}, sortBy = "", sortDir = 1) {
  const queryParams = {};

  if (filterBy.freeText) {
    queryParams.q = filterBy.freeText;
  }

  if (filterBy.genre) {
    queryParams.genre = filterBy.genre;
  }

  const songs = await httpService.get("song", queryParams);
  return songs;
}

export async function getById(songId) {
  const song = await httpService.get(`song/${songId}`);
  return song;
}

async function remove(songId) {
  const response = await httpService.delete(`song/${songId}`);
  return response;
}

async function add(song) {
  const newSong = await httpService.post(`song`, song);
  return newSong;
}

async function update(songId) {
  const response = await httpService.patch(`song/${songId}`);
  return response;
}
