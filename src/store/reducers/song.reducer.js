/* eslint-disable no-case-declarations */
export const SET_SONG = 'SET_SONG';
export const SET_SONG_OBJ = 'SET_SONG_OBJ';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';
export const SET_PLAYING = 'SET_PLAYING';
export const SET_VOLUME = 'SET_VOLUME';
export const SET_DURATION = 'SET_DURATION';
export const SET_SECS = 'SET_SECS';
export const SET_ENDED = 'SET_ENDED';
export const SET_IS_READY = 'SET_IS_READY';

const initialState = {
  currentSong: null,
  songObj: {},
  secs: 0, // progression of the audio in secs (can be float)
  hasEnded: false,
  isReady: false,
  isPlaying: false,
  currentDuration: 0, // full duration of audio
  volume: 1,
};

export function songReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SONG:
      return { ...state, currentSong: action.payload };
    case SET_VOLUME:
      return { ...state, volume: action.payload };
    case TOGGLE_PLAYING:
      return { ...state, isPlaying: !state.isPlaying };
    case SET_PLAYING:
      return { ...state, isPlaying: action.payload };
    case SET_DURATION:
      return { ...state, currentDuration: action.payload };
    case SET_SONG_OBJ:
      return {
        ...state,
        currentDuration: action.payload?.duration || 0,
        currentSong: action.payload?.url || '',
        songObj: { ...state.songObj, ...action.payload },
      };
    case SET_SECS:
      const ended = action.payload >= state.currentDuration
      return { ...state, secs: action.payload, hasEnded: ended };
    case SET_ENDED:
      return { ...state, hasEnded: action.payload };
    case SET_IS_READY:
      return { ...state, isReady: action.payload };
    default:
      return state;
  }
}
