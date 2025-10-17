import { chooseFromArray, getRandomIntInclusive, makeId } from './util.service';
import { faker } from '@faker-js/faker';

export function createDummySongs(amount = 10) {
  const songs = [];
  const thumbnails = [
    'https://i.scdn.co/image/ab67616d000048515dc62d661568dcaa3b18ce6a',
    'https://i.scdn.co/image/ab67616d00004851ae6d8e36136353d550b2587d',
    'https://i.scdn.co/image/ab67616d000048515074bd0894cb1340b8d8a678',
    'https://i.scdn.co/image/ab67616d00004851926909699c1214051c7a9937',
    'https://i.scdn.co/image/ab67616d00004851aaeb5c9fb6131977995b7f0e',
  ];
  const genres = [
    'Rock',
    'Pop',
    'Jazz',
    'Classical',
    'Hip Hop',
    'Electronic',
    'Reggae',
    'Blues',
    'Country',
    'Funk',
    'Soul',
    'Metal',
    'R&B',
    'Punk',
    'Disco',
    'Folk',
    'Techno',
    'Ska',
    'House',
    'Gospel',
  ];
  for (let i = 0; i < amount; i++) {
    songs.push({
      _id: makeId(),
      title: faker.music.songName(),
      artist: faker.person.fullname,
      duration: getRandomIntInclusive(5, 15),
      albumName: faker.music.album(),
      songThumbnail: chooseFromArray(thumbnails),
      releaseDate: new Date(),
      genres: [chooseFromArray(genres)]
    });
  }
  return songs;
}
