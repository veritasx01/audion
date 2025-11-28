export const SET_SONG = 'SET_SONG';
export const SET_SONG_OBJ = 'SET_SONG_OBJ';
export const TOGGLE_PLAYING = 'TOGGLE_PLAYING';
export const SET_VOLUME = 'SET_VOLUME';
export const SET_DURATION = 'SET_DURATION';

const initialState = {
  currentSong: null,
  songObj: { secs: 0, ended: false },
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
    case SET_SONG_OBJ:
      return {
        ...state,
        currentDuration: action.payload?.duration || 0,
        currentSong: action.payload?.url || '',
        songObj: { ...state.songObj, ...action.payload },
      };
    case SET_SECS:
      return { ...state, secs: action.payload };
    case SET_ENDED:
      return { ...state, hasEnded: action.payload };
    case SET_IS_READY:
      return { ...state, isReady: action.payload };
    default:
      return state;
  }
}
