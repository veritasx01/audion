export const SET_SONG = 'SET_SONG';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';

const initialState = {
  currentSong: null,
  isPlaying: false,
  currentDuration: 0,
  volume: 100,
};

export function songReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SONG:
      return { ...state, currentSong: action.payload };
    case TOGGLE_PLAYING:
      return { ...state, isPlaying: !state.isPlaying };
    default:
      return state;
  }
}
