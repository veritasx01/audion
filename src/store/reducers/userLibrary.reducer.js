export const SET_PLAYLISTS_IN_LIBRARY = "SET_PLAYLISTS_IN_LIBRARY";
export const REMOVE_PLAYLIST_FROM_LIBRARY = "REMOVE_PLAYLIST_FROM_LIBRARY";
export const ADD_PLAYLIST_TO_LIBRARY = "ADD_PLAYLIST_TO_LIBRARY";
export const SET_IS_LOADING = "SET_IS_LOADING";

export const userLibraryActions = {
  SET_PLAYLISTS_IN_LIBRARY,
  REMOVE_PLAYLIST_FROM_LIBRARY,
  ADD_PLAYLIST_TO_LIBRARY,
  SET_IS_LOADING,
};

const initialState = {
  playlists: [],
  isLoading: false,
};

export function userLibraryReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYLISTS_IN_LIBRARY:
      return { ...state, playlists: action.payload };
    case REMOVE_PLAYLIST_FROM_LIBRARY:
      return {
        ...state,
        playlists: state.playlists.filter(
          (playlist) => playlist._id !== action.payload
        ),
      };
    case ADD_PLAYLIST_TO_LIBRARY:
      return {
        ...state,
        playlists: [...state.playlists, action.payload],
      };
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}
