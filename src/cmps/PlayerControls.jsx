import { togglePlaying } from "../store/actions/song.action";
import { SongProgress } from "./SongProgress";
import { useDispatch } from "react-redux";
import shuffleIcon from "../assets/icons/shuffle.svg";
import prevIcon from "../assets/icons/prev.svg";
import playIcon from "../assets/icons/play.svg";
import nextIcon from "../assets/icons/next.svg";
import repeatIcon from "../assets/icons/repeat.svg";

export function PlayerControls() {
  // TODO: spotify has a diffrent div for the smaller buttons on each side for different gaps from the play button
  // this is not currently the case as the gap is equal, also the buttons don't have margins

  const dispatch = useDispatch();
  return (
    <div className="player-container flex column">
      <div className="generals-container flex align-center">
        {/* shuffle button */}
        <div style={{ marginRight: "8px", display: "flex", gap: "8px" }}>
          <button className="smaller-button hov-enlarge">
            <span className="size-16" aria-hidden="true">
              <img src={shuffleIcon} alt="Shuffle icon" />
            </span>
          </button>
          {/* previous button */}
          <button className="smaller-button hov-enlarge">
            <span className="size-16" aria-hidden="true">
              <img src={prevIcon} alt="Previous icon" />
            </span>
          </button>
        </div>
        {/* play song button */}
        <button
          className="player-button hov-enlarge"
          onClick={() => dispatch(togglePlaying())}
        >
          <span className="size-16" aria-hidden="true">
            <img src={playIcon} alt="Play icon" />
          </span>
        </button>
        {/* next button */}
        <div style={{ marginLeft: "8px", display: "flex", gap: "8px" }}>
          <button className="smaller-button hov-enlarge">
            <span className="size-16" aria-hidden="true">
              <img src={nextIcon} alt="Next icon" />
            </span>
          </button>
          {/* enable repeat button */}
          <button className="smaller-button hov-enlarge">
            <span className="size-16" aria-hidden="true">
              <img src={repeatIcon} alt="Repeat icon" />
            </span>
          </button>
        </div>
      </div>
      <SongProgress></SongProgress>
    </div>
  );
}
