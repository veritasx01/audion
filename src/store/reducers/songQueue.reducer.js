import {
  getRandomExcept,
  shuffleIndexArray,
} from '../../services/util.service';

/* eslint-disable no-case-declarations */
export const CLEAR_QUEUE = 'CLEAR_QUEUE';
export const PREV_SONG = 'PREV_SONG';
export const NEXT_SONG = 'NEXT_SONG';
export const TOGGLE_SHUFFLE = 'TOGGLE_SHUFFLE';
export const TOGGLE_REPEAT = 'TOGGLE_REPEAT';
export const TOGGLE_REPEAT_CURRENT = 'TOGGLE_REPEAT_CURRENT';
export const SET_SONG_QUEUE = 'SET_SONG_QUEUE';
export const SEEK_INDEX = 'SEEK_INDEX';
export const SET_PLAYLIST_ID = 'SET_PLAYLIST_ID';

const initialState = {
  currentIndex: 0,
  playlistId: null,
  songQueue: [],
  indexArray: [],
  shuffleIndex: 0,
  isRepeating: false,
  isShuffle: false,
};

export function songQueueReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_QUEUE:
      return { ...state, currentIndex: 0, songQueue: [], playlistId: null };

    case PREV_SONG:
      if (state.isShuffle) {
        if (state.shuffleIndex === 0) return state;
        return {
          ...state,
          shuffleIndex: state.shuffleIndex - 1,
          currentIndex: state.indexArray[state.shuffleIndex - 1],
        };
      }

      if (state.currentIndex === 0) return state;
      return { ...state, currentIndex: state.currentIndex - 1 };

    case NEXT_SONG:
      if (state.isShuffle) {
        if (state.shuffleIndex === state.songQueue.length - 1) {
          return { ...state, currentIndex: state.songQueue.length };
        }
        return {
          ...state,
          shuffleIndex: state.shuffleIndex + 1,
          currentIndex: state.indexArray[state.shuffleIndex + 1],
        };
      }

      if (state.currentIndex === state.songQueue.length - 1) {
        if (state.isRepeating) {
          return { ...state, currentIndex: 0 };
        }
        return { ...state, currentIndex: state.songQueue.length };
      }
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

    case TOGGLE_REPEAT:
      return { ...state, isRepeating: !state.isRepeating };

    case TOGGLE_SHUFFLE:
      if (!state.isShuffle) {
        const arr = shuffleIndexArray(
          state.currentIndex,
          state.songQueue.length
        );
        const curIndex = arr[state.currentIndex];
        return {
          ...state,
          isShuffle: true,
          currentIndex: curIndex,
          indexArray: arr,
          shuffleIndex: 0,
        };
      }
      return { ...state, isShuffle: false };

    case SET_PLAYLIST_ID:
      return { ...state, playlistId: action.payload };

    default:
      return state;
  }
}
