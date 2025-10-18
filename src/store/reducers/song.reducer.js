export const SET_SONG = 'SET_SONG';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';
export const SET_VOLUME = "SET_VOLUME";

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
    default:
      return state;
  }
}
