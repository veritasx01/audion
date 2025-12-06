import fallbackImage from "../assets/images/black_image.jpg";

export function NowPlayingView({ songObj }) {
  return (
    <div>
      <p className="now-playing-artist-header">{songObj?.artist}</p>
      <NowPlayingDetails songObj={songObj}></NowPlayingDetails>
    </div>
  );
}

function NowPlayingDetails({ songObj }) {
  return (
    <div className="now-playing-details-container">
      <img
        className="now-playing-image"
        src={songObj?.thumbnail || fallbackImage}
      ></img>
      <p className="now-playing-title">{songObj?.title}</p>
      <p className="now-playing-artist">{songObj?.artist}</p>
    </div>
  );
}
