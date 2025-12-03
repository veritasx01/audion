import {
  CLEAR_QUEUE,
  PREV_SONG,
  NEXT_SONG,
  TOGGLE_SHUFFLE,
  TOGGLE_REPEAT,
  SET_SONG_QUEUE,
  SEEK_INDEX,
} from '../reducers/songQueue.reducer';

export function clearSongQueue() {
  return { type: CLEAR_QUEUE };
}

export function goToPreviousSong() {
  return { type: PREV_SONG };
}

export function goToNextSong() {
  return { type: NEXT_SONG };
}

export function toggleShuffle() {
  return { type: TOGGLE_SHUFFLE };
}

export function toggleRepeat() {
  return { type: TOGGLE_REPEAT };
}

export function setSongQueue(newSongs) {
  return { type: SET_SONG_QUEUE, payload: newSongs };
}

export function seekSongQueueIndex(index) {
  return { type: SEEK_INDEX, payload: index };
}
