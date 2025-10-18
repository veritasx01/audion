import { SET_SONG, SET_VOLUME, TOGGLE_PLAYING } from '../reducers/song.reducer';

export function updateCurrentSong(song) {
  return { type: SET_SONG, payload: song };
}

export function togglePlaying() {
  return { type: TOGGLE_PLAYING };
}

export function updateVolume(volume) {
  return { type: SET_VOLUME, payload: volume };
}
