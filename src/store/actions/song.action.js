import { SET_SONG, TOGGLE_PLAYING } from '../reducers/song.reducer';

export function updateCurrentSong(song) {
  return { type: SET_SONG, payload: song };
}

export function togglePlaying() {
  return { type: TOGGLE_PLAYING };
}
