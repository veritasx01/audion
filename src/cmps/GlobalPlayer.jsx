import { useSelector, useDispatch } from "react-redux";
import ReactPlayer from "react-player";
import {
  updateCurrentSong,
  updateCurrentDuration,
} from "../store/actions/song.action";
import { fetchYouTubeDuration } from "../services/util.service";
import { useEffect } from "react";

export function GlobalPlayer() {
  const isPlaying = useSelector((state) => state.songModule.isPlaying);
  const volume = useSelector((state) => state.songModule.volume);
  const dispatch = useDispatch();
  useEffect(() => {
    const globalSong = "https://www.youtube.com/watch?v=3mbBbFH9fAg";

    async function fetchYoutube() {
      try {
        const retValue = await fetchYouTubeDuration(globalSong);
        dispatch(updateCurrentSong(globalSong));
        dispatch(updateCurrentDuration(retValue));
      } catch (err) {
        console.error("Failed to fetch YouTube duration:", err);
      }
    }

    fetchYoutube();
  }, [dispatch]);
  return (
    <div className="debug">
      <div
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
        }}
      >
        <ReactPlayer
          src="https://www.youtube.com/watch?v=3mbBbFH9fAg"
          playing={isPlaying}
          volume={volume}
        />
      </div>
    </div>
  );
}
