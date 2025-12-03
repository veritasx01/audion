import { songs } from '../../assets/data/songs';

export const songService = {
  query,
  getById,
};

export async function query(filterBy = {}) {
  let songsCopy = [...songs];
  if (filterBy?.title) {
    songsCopy = songsCopy.filter((song) =>
      song.title.toLowerCase().includes(filterBy.title.toLowerCase())
    );
  }
  return Promise.resolve(songsCopy);
}

export async function getById(songId) {
  const song = songs.filter((song) => songId === song._id);
  return new Promise.resolve(song);
  /*
  return httpService.get(`song/${songId}`);
   */
}
/*
async function remove(songId) {
  return;
    return httpService.delete(`car/${carId}`);
  }
*/

/*
async function add(song) {
}
*/

/*
async function update(songId) {
}
*/
