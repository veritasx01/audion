import { useDispatch, useSelector } from "react-redux";
import {
  setPlaying,
  togglePlaying,
} from "../store/actions/song.action";
import { clearSongQueue, setPlaylistId, setSongQueue } from "../store/actions/songQueue.action";

export const useSongController = (song, playlistId = null) => {
  const dispatch = useDispatch();
  const currentSongId = useSelector((state) => state.songModule.songObj._id);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);
  if (!song) {
    const falseConst = false;
    const emptyFunc = () => {};
    return { falseConst, emptyFunc };
  }

  // Calculate directly
  const isCurrentSongPlaying = currentSongId === song._id && isPlaying;

  const toggleSong = () => {
    const lastId = currentSongId;
    dispatch(clearSongQueue());
    dispatch(setSongQueue([song]));
    dispatch(setPlaylistId(playlistId));
    //dispatch(updateSongObject(song));
    if (lastId !== song._id) {
      dispatch(setPlaying(true));
    } else {
      dispatch(togglePlaying());
    }
  };

  return { isCurrentSongPlaying, toggleSong };
};
