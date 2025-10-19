import { VolumeBar } from "./VolumeBar";
import nowPlayingViewIcon from "../assets/icons/now-playing-view.svg";
import queueIcon from "../assets/icons/queue.svg";
import enterFullScreenIcon from "../assets/icons/enter-full-screen.svg";

export function SongControls() {
  return (
    <div>
      <div className="controls-container">
        <button className="controls-button hov-enlarge">
          <span className="size-32" aria-hidden="true">
            <img src={nowPlayingViewIcon} alt="Now playing view icon" />
          </span>
        </button>
        <button className="controls-button hov-enlarge">
          <span className="size-32" aria-hidden="true">
            <img src={queueIcon} alt="Queue icon" />
          </span>
        </button>
        <VolumeBar></VolumeBar>
        <button className="controls-button hov-enlarge trans3">
          <span className="size-32" aria-hidden="true">
            <img src={enterFullScreenIcon} alt="Enter full screen icon" />
          </span>
        </button>
      </div>
    </div>
  );
}
