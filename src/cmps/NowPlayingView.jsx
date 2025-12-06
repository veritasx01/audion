import { NowPlayingDetails } from "./NowPlayingDetails";

export function NowPlayingView({ songObj }) {
  return (
    <div>
      <p className="now-playing-artist-header">{songObj?.artist}</p>
      <NowPlayingDetails songObj={songObj}></NowPlayingDetails>
    </div>
  );
}