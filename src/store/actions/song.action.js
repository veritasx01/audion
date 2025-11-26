import { SET_SONG, SET_VOLUME, TOGGLE_PLAYING, SET_DURATION, SET_SONG_OBJ } from '../reducers/song.reducer';

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

export function updateSongObject(songObject) {
  return { type: SET_SONG_OBJ, payload: songObject };
}

