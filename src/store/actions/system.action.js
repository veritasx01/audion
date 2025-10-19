import {
  TOGGLE_LIBRARY_VIEW,
  TOGGLE_NOW_PLAYING_VIEW,
} from '../reducers/system.reducer';

export function toggleNowPlaying() {
  return { type: TOGGLE_NOW_PLAYING_VIEW };
}

export function toggleLibrary() {
  return { type: TOGGLE_LIBRARY_VIEW };
}
