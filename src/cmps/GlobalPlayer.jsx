import { useSelector } from "react-redux";
import ReactPlayer from "react-player";

export function GlobalPlayer() {
  const isPlaying = useSelector((state) => state.songModule.isPlaying);
  const volume = useSelector((state) => state.songModule.volume);
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
