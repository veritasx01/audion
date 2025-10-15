export const SET_SONG = 'SET_SONG';

const initialState = {
  currentSong: null,
  isPlaying: false,
  currentDuration: 0,
};

export function songReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SONG:
      return { ...state, currentSong: action.payload };
    default:
      return state;
  }
}
