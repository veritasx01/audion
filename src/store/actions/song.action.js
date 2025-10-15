import { SET_SONG } from '../reducers/song.reducer';

export function updateCurrentSong(song) {
  return { type: SET_SONG, payload: song };
}
