export const CLEAR_QUEUE = 'CLEAR_QUEUE';
export const PREV_SONG = 'PREV_SONG';
export const NEXT_SONG = 'NEXT_SONG';
export const TOGGLE_SHUFFLE = 'TOGGLE_SHUFFLE';
export const TOGGLE_REPEAT = 'TOGGLE_REPEAT';
export const TOGGLE_REPEAT_CURRENT = 'TOGGLE_REPEAT_CURRENT';
export const SET_SONG_QUEUE = 'SET_SONG_QUEUE';
export const SEEK_INDEX = 'SEEK_INDEX';

const initialState = {
  currentIndex: 0,
  songQueue: [],
  isRepeating: false,
  isShuffle: false,
};

export function songQueueReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_QUEUE:
      return { ...state, currentIndex: 0, songQueue: [] };
    case PREV_SONG:
      if (state.currentIndex === 0) return state;
      return { ...state, currentIndex: state.currentIndex - 1 };
    case NEXT_SONG:
      if (state.currentIndex === state.songQueue.length - 1) {
        if (state.isRepeating) {
          return { ...state, currentIndex: 0 };
        }
        return state;
      }
      console.log('index:', state.currentIndex + 1);
      return { ...state, currentIndex: state.currentIndex + 1 };
    case SET_SONG_QUEUE:
      return { ...state, songQueue: action.payload };
    case SEEK_INDEX:
      if (
        typeof action.payload !== 'number' ||
        action.payload < 0 ||
        action.payload >= state.songQueue.length
      ) {
        return state;
      }
      return { ...state, currentIndex: action.payload };
    default:
      return state;
  }
}
