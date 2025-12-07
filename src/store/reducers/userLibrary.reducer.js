export const SET_PLAYLISTS_IN_LIBRARY = "SET_PLAYLISTS_IN_LIBRARY";
export const REMOVE_PLAYLIST_FROM_LIBRARY = "REMOVE_PLAYLIST_FROM_LIBRARY";
export const ADD_PLAYLIST_TO_LIBRARY = "ADD_PLAYLIST_TO_LIBRARY";
export const SET_IS_LOADING = "SET_IS_LOADING";
export const ADD_SONG_TO_LIKED_SONGS = "ADD_SONG_TO_LIKED_SONGS";
export const REMOVE_SONG_FROM_LIKED_SONGS = "REMOVE_SONG_FROM_LIKED_SONGS";

export const userLibraryActions = {
  SET_IS_LOADING,
  SET_PLAYLISTS_IN_LIBRARY,
  ADD_PLAYLIST_TO_LIBRARY,
  REMOVE_PLAYLIST_FROM_LIBRARY,
  ADD_SONG_TO_LIKED_SONGS,
  REMOVE_SONG_FROM_LIKED_SONGS,
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

    case ADD_SONG_TO_LIKED_SONGS:
      return {
        ...state,
        playlists: state.playlists.map((playlist) => {
          if (playlist.isLikedSongs) {
            return {
              ...playlist,
              songs: [...playlist.songs, action.payload],
            };
          } else return playlist;
        }),
      };

    case REMOVE_SONG_FROM_LIKED_SONGS:
      return {
        ...state,
        playlists: state.playlists.map((playlist) => {
          if (playlist.isLikedSongs) {
            return {
              ...playlist,
              songs: playlist.songs.filter(
                (song) => song._id !== action.payload
              ),
            };
          } else return playlist;
        }),
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
