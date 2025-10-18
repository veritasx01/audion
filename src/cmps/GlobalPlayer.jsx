import { useSelector } from "react-redux";
import ReactPlayer from "react-player";

export function GlobalPlayer() {
  const isPlaying = useSelector((state) => state.songModule.isPlaying);
  return (
    <div className="debug">
      <div style={{ display: "none" }}>
        <ReactPlayer
          src="https://www.youtube.com/watch?v=3mbBbFH9fAg"
          playing={isPlaying}
        />
      </div>
    </div>
  );
}
