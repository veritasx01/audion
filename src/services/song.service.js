import { makeId } from './util.service';
import { faker } from '@faker-js/faker';

export function createDummySongs(amount = 10) {
  const songs = [];
  for (let i = 0; i < amount; i++) {
    songs.push({
      _id: makeId(),
      title: faker.music.songName(),
      artist: faker.person.fullname,
      duration: 0,
      albumName: faker.music.album(),
      releaseDate: new Date(),
    });
  }
  return songs;
}