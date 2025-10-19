export const LOADING_START = 'LOADING_START';
export const LOADING_DONE = 'LOADING_DONE';
export const TOGGLE_NOW_PLAYING_VIEW = 'TOGGLE_NOW_PLAYING_VIEW';
export const TOGGLE_LIBRARY_VIEW = 'TOGGLE_LIBRARY_VIEW';

const initialState = {
  isLoading: false,
  nowPlayingView: false,
  libraryView: true,
};

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true };
    case LOADING_DONE:
      return { ...state, isLoading: false };
    case TOGGLE_NOW_PLAYING_VIEW:
      return { ...state, nowPlayingView: !state.nowPlayingView };
    case TOGGLE_LIBRARY_VIEW:
      return { ...state, libraryView: !state.libraryView };
    default:
      return state;
  }
}
