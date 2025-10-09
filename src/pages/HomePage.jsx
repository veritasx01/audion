export function HomePage() {
  return (
    <section className="home">
      <div className="library-view">
        <h1>
          left view,
          <br />
          library view
        </h1>
      </div>
      <div className="main-view">
        <h1>
          main view
          <br />
          pages get rendered inside here
        </h1>
      </div>
      <div className="song-view">
        <h1>
          right view
          <br />
          song and artist details
        </h1>
      </div>
    </section>
  );
}
