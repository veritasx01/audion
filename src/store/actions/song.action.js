import { SET_SONG, SET_VOLUME, TOGGLE_PLAYING, SET_DURATION } from '../reducers/song.reducer';

export function updateCurrentSong(song) {
  return { type: SET_SONG, payload: song };
}

export function updateCurrentDuration(duration) {
  return { type: SET_DURATION, payload: duration };
}

export function togglePlaying() {
  return { type: TOGGLE_PLAYING };
}

export function updateVolume(volume) {
  return { type: SET_VOLUME, payload: volume };
}
