export const SET_SONG = 'SET_SONG';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';
export const SET_VOLUME = 'SET_VOLUME';
export const SET_DURATION = 'SET_DURATION';

const initialState = {
  currentSong: null,
  isPlaying: false,
  currentDuration: 0,
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
    case SET_DURATION:
      return { ...state, currentDuration: action.payload };
    default:
      return state;
  }
}
