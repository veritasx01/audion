import { VolumeBar } from "./VolumeBar";
import { toggleNowPlaying } from "../store/actions/system.action";
import { useDispatch, useSelector } from "react-redux";

export function SongControls() {
  const dispatch = useDispatch();
  const nowPlaying = useSelector((state) => state.systemModule.nowPlayingView);
  const toggleNowPlayingView = () => dispatch(toggleNowPlaying());
  return (
    <div>
      <div className="controls-container">
        <button
          onClick={toggleNowPlayingView}
          className={`controls-button hov-enlarge${
            nowPlaying ? " green-button" : ""
          }`}
        >
          <span className="size-32">{nowPlayingIcon(nowPlaying)}</span>
        </button>
        <button className="controls-button hov-enlarge">
          <span className="size-32">{queueIcon()}</span>
        </button>
        <VolumeBar></VolumeBar>
        <button className="controls-button hov-enlarge trans3">
          <span className="size-32">{enlargeIcon()}</span>
        </button>
      </div>
    </div>
  );
}

function nowPlayingIcon(nowPlaying) {
  if (nowPlaying) {
    return (
      <svg viewBox="0 0 16 16" fill="#1ed760">
        <path d="M11.196 8 6 5v6z"></path>
        <path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25z"></path>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="#b2b2b2">
      <path d="M11.196 8 6 5v6z"></path>
      <path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25z"></path>
    </svg>
  );
}

function queueIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="#b2b2b2">
      <path d="M15 15H1v-1.5h14zm0-4.5H1V9h14zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5m2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2z"></path>
    </svg>
  );
}

function enlargeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="#b2b2b2">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.25 3C0.25 2.0335 1.0335 1.25 2 1.25H5.375V2.75H2C1.86193 2.75 1.75 2.86193 1.75 3V5.42857H0.25V3ZM14 2.75H10.625V1.25H14C14.9665 1.25 15.75 2.0335 15.75 3V5.42857H14.25V3C14.25 2.86193 14.1381 2.75 14 2.75ZM1.75 10.5714V13C1.75 13.1381 1.86193 13.25 2 13.25H5.375V14.75H2C1.0335 14.75 0.25 13.9665 0.25 13V10.5714H1.75ZM14.25 13V10.5714H15.75V13C15.75 13.9665 14.9665 14.75 14 14.75H10.625V13.25H14C14.1381 13.25 14.25 13.1381 14.25 13Z"
      ></path>
    </svg>
  );
}
