import {
  SET_SONG,
  SET_VOLUME,
  TOGGLE_PLAYING,
  SET_DURATION,
  SET_SONG_OBJ,
  SET_ENDED,
  SET_SECS,
  SET_IS_READY,
  SET_PLAYING,
} from '../reducers/song.reducer';

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

export function updateSecs(secs) {
  return { type: SET_SECS, payload: secs };
}

export function setAudioEnded(hasEnded) {
  return { type: SET_ENDED, payload: hasEnded };
}

export function setAudioReady(isReady) {
  return { type: SET_IS_READY, payload: isReady };
}

export function setPlaying(isPlaying) {
  return {type: SET_PLAYING, payload: isPlaying};
}