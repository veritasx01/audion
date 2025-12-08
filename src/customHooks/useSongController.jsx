import { useDispatch, useSelector } from "react-redux";
import { updateSongObject, setPlaying, togglePlaying } from "../store/actions/song.action";

export const useSongController = (song) => {
  const dispatch = useDispatch();
  const currentSongId = useSelector((state) => state.songModule.songObj._id);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);

  // Calculate directly
  const isCurrentSongPlaying = currentSongId === song._id && isPlaying;

  const toggleSong = () => {
    const lastId = currentSongId;
    dispatch(updateSongObject(song));
    if (lastId !== song._id) {
      dispatch(setPlaying(true));
    } else {
      dispatch(togglePlaying());
    }
  };

  return { isCurrentSongPlaying, toggleSong };
};