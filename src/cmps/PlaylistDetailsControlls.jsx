import playIcon from "../assets/icons/play.svg";
import moreOptionsIcon from "../assets/icons/meatball-menu.svg";

export function PlaylistDetailsHeaderControlls() {
  return (
    <section className="playlist-controls">
      <div className="controls-primary">
        <button className="playlist-play-pause-btn">
          <img src={playIcon} alt="Play" />
        </button>
        <button
          className="playlist-options-btn"
          title="More options"
          onClick={(e) => {
            // Show a header context menu at the button position
          }}
        >
          <img src={moreOptionsIcon} alt="More" />
        </button>
      </div>
    </section>
  );
}
