export const SET_PLAYLISTS = "SET_PLAYLISTS";
export const REMOVE_PLAYLIST = "REMOVE_PLAYLIST";
export const ADD_PLAYLIST = "ADD_PLAYLIST";
export const EDIT_PLAYLIST_DETAILS = "EDIT_PLAYLIST_DETAILS";
export const ADD_SONG = "ADD_SONG";
export const REMOVE_SONG = "REMOVE_SONG";
export const SET_FILTER = "SET_FILTER";
export const UNDO_CHANGES = "UNDO_CHANGES";
export const SET_IS_LOADING = "SET_IS_LOADING";

const initialState = {
  playlists: [],
  filterBy: {
    title: "",
    description: "",
    createdBy: "",
  },
  isLoading: false,
  lastPlaylists: [],
};

export function playlistReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYLISTS:
      return { ...state, playlists: action.payload };
    case REMOVE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.filter(
          (playlist) => playlist._id !== action.payload
        ),
        lastPlaylists: [...state.lastPlaylists],
      };
    case ADD_PLAYLIST:
      return {
        ...state,
        playlists: [...state.playlists, action.payload],
      };
    case EDIT_PLAYLIST_DETAILS:
      return {
        ...state,
        playlists: state.playlists.map((playlist) =>
          playlist._id === action.payload._id ? action.payload : playlist
        ),
      };

    case ADD_SONG:
      return {
        ...state,
        playlists: state.playlists.map((playlist) =>
          playlist._id === action.payload.playlistId
            ? { ...playlist, songs: [...playlist.songs, action.payload.song] }
            : playlist
        ),
      };

    case REMOVE_SONG:
      return {
        ...state,
        playlists: state.playlists.map((playlist) =>
          playlist.id === action.payload.playlistId
            ? {
                ...playlist,
                songs: playlist.songs.filter(
                  (song) => song._id !== action.payload.songId
                ),
              }
            : playlist
        ),
      };

    case SET_FILTER:
      return {
        ...state,
        filterBy: { ...state.filterBy, ...action.payload },
      };
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case UNDO_CHANGES: // for rollingback an optimistic update implementation
      console.log("UNDO");
      return {
        ...state,
        playlists: [...state.lastPlaylists],
      };
    default:
      return state;
  }
}
