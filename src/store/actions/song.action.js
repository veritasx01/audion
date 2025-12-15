import { store } from '../store';
import { getPlaylistSongFullDetails } from '../../services/playlist/playlist.service';
import {
  SET_SONG,
  SET_VOLUME,
  TOGGLE_PLAYING,
  SET_ENDED,
  SET_SECS,
  SET_IS_READY,
  SET_PLAYING,
} from '../reducers/song.reducer';

export async function updateCurrentSong(song, playlistId = null) {
  if (!song.url && playlistId) {
    console.debug(
      `song.action.js: Song ${song.title} missing URL: ${JSON.stringify(
        song
      )} fetching details from youtube...`
    );
    getPlaylistSongFullDetails(playlistId, song._id).then((fullSong) => {
      console.debug(
        `song.action.js: Fetched full song details including URL & duration: ${JSON.stringify(
          fullSong
        )}`
      );
      console.log('Dispatching SET_SONG with full song details');
      store.dispatch({ type: SET_SONG, payload: fullSong });
    });
    return;
  } else store.dispatch({ type: SET_SONG, payload: song });
}

export function togglePlaying() {
  return { type: TOGGLE_PLAYING };
}

export function updateVolume(volume) {
  return { type: SET_VOLUME, payload: volume };
}

export function updateSecs(secs) {
  return { type: SET_SECS, payload: secs };
}

export function setAudioEnded(hasEnded) {
  return { type: SET_ENDED, payload: hasEnded };
}

export function setAudioReady(isReady) {
  return { type: SET_IS_READY, payload: isReady };
}

export function setPlaying(isPlaying) {
  return { type: SET_PLAYING, payload: isPlaying };
}
