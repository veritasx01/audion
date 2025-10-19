import addIcon from "../assets/icons/add.svg";
export function SongWidget() {
  return (
    <div className="song-controls-container">
      <div>
        <img src="https://i.scdn.co/image/ab67616d00004851384765aca7a4341b9652d29e"></img>
      </div>
      <div className="song-description">
        <p className="song-heading">Black Hole Sun</p>
        <p className="song-artist">Soundgarden</p>
      </div>
      <div style={{ height: "32px", justifySelf: "center", margin: "0 8px" }}>
        <button className="add-button">
          <span className="size-32" aria-hidden="true">
            <img src={addIcon} alt="Add icon" />
          </span>
        </button>
      </div>
    </div>
  );
}
