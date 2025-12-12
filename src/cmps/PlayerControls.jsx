import { useDebounce } from "../customHooks/useDebounce";
import { togglePlaying } from "../store/actions/song.action";
import {
  goToNextSong,
  goToPreviousSong,
  toggleRepeat,
  toggleShuffle,
} from "../store/actions/songQueue.action";
import { SongProgress } from "./SongProgress";
import { useDispatch, useSelector } from "react-redux";

export function PlayerControls() {
  // TODO: spotify has a diffrent div for the smaller buttons on each side for different gaps from the play button
  // this is not currently the case as the gap is equal, also the buttons don't have margins
  const isPlaying = useSelector((state) => state.songModule.isPlaying);
  const repeating = useSelector((state) => state.songQueueModule.isRepeating);
  const isShuffle = useSelector((state) => state.songQueueModule.isShuffle);
  const songInPlayer = useSelector((state) => state.songModule.songObj);
  const dispatch = useDispatch();

  const isPlayerEmpty = () => {
    return !songInPlayer || Object.keys(songInPlayer).length === 0;
  };
  const nextSong = useDebounce(() => dispatch(goToNextSong()), 100);
  const prevSong = useDebounce(() => dispatch(goToPreviousSong()), 100);
  const toggleSongRepeat = () => dispatch(toggleRepeat());
  const toggleSongShuffle = () => dispatch(toggleShuffle());

  return (
    <div className="player-container flex column">
      <div className="generals-container flex align-center">
        {/* shuffle button */}
        <div className="left-buttons-container">
          <button
            className={`smaller-button hov-enlarge${
              isShuffle ? " green-button" : ""
            }`}
            onClick={() => {
              if (isPlayerEmpty()) return;
              toggleSongShuffle();
            }}
          >
            <span className="size-16" aria-hidden="true">
              {shuffleIcon(isShuffle)}
            </span>
          </button>
          {/* previous button */}
          <button
            className="smaller-button hov-enlarge"
            onClick={() => {
              if (isPlayerEmpty()) return;
              prevSong();
            }}
          >
            <span className="size-16" aria-hidden="true">
              {prevIcon()}
            </span>
          </button>
        </div>
        {/* play song button */}
        <button
          className="player-button hov-enlarge"
          onClick={() => {
            if (isPlayerEmpty()) return;
            dispatch(togglePlaying());
          }}
        >
          <span className="size-16" aria-hidden="true">
            {playIcon(isPlaying)}
          </span>
        </button>
        {/* next button */}
        <div className="right-buttons-container">
          <button
            className="smaller-button hov-enlarge"
            onClick={() => {
              if (isPlayerEmpty()) return;
              nextSong();
            }}
          >
            <span className="size-16" aria-hidden="true">
              {nextIcon()}
            </span>
          </button>
          {/* enable repeat button */}
          <button
            className={`smaller-button hov-enlarge${
              repeating ? " green-button" : ""
            }`}
            onClick={() => {
              if (isPlayerEmpty()) return;
              toggleSongRepeat();
            }}
          >
            <span className="size-16" aria-hidden="true">
              {repeatIcon(repeating)}
            </span>
          </button>
        </div>
      </div>
      <SongProgress></SongProgress>
    </div>
  );
}

function shuffleIcon(on) {
  if (on) {
    return (
      <svg viewBox="0 0 16 16" fill="#1ed760">
        <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path>
        <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="#b2b2b2">
      <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path>
      <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path>
    </svg>
  );
}

function prevIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="#b2b2b2">
      <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7z"></path>
    </svg>
  );
}

function playIcon(isPlaying) {
  if (!isPlaying) {
    return (
      <svg viewBox="0 0 16 16" fill="black">
        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"></path>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="black">
      <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"></path>
    </svg>
  );
}

function nextIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="#b2b2b2">
      <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"></path>
    </svg>
  );
}

function repeatIcon(on) {
  if (on) {
    return (
      <svg viewBox="0 0 16 16" fill="#1ed760">
        <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75z"></path>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="#b2b2b2">
      <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75z"></path>
    </svg>
  );
}
