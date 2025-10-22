import { useSelector, useDispatch } from "react-redux";
import ReactPlayer from "react-player";
import {
  updateCurrentSong,
  updateCurrentDuration,
} from "../store/actions/song.action";
import { fetchYouTubeDuration } from "../services/util.service";
import { useEffect, useRef } from "react";

export function GlobalPlayer() {
  const playerRef = useRef(null);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);
  const volume = useSelector((state) => state.songModule.volume);
  const globalSong = useSelector((state) => state.songModule.currentSong);
  const secs = useSelector((state) => state.songModule.songObj.secs);
  const dispatch = useDispatch();
  useEffect(() => {
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
  }, [globalSong, dispatch]);

  useEffect(() => {
    if (playerRef.current.api?.seekTo) {
      playerRef.current.api.seekTo(secs, "seconds");
    }
  }, [secs]);

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
          ref={playerRef}
          src={globalSong}
          playing={isPlaying}
          volume={volume}
        />
      </div>
    </div>
  );
}
