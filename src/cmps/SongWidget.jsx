export function SongWidget() {
  return (
    <div className="song-controls-container">
      <div>
        <img
          src="https://i.scdn.co/image/ab67616d00004851384765aca7a4341b9652d29e"
        ></img>
      </div>
      <div className="song-description">
        <p className="song-heading">
          Black Hole Sun
        </p>
        <p className="song-artist">Soundgarden</p>
      </div>
      <div style={{ height: "32px", justifySelf: "center", margin: "0 8px" }}>
        <button className="add-button">
          <span className="size-32" aria-hidden="true">
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="#b0b0b0">
              <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
              <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75"></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
