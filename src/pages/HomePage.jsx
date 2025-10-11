import { useState } from "react";

export function HomePage() {
  const [nowPlayingbar, setnowPlayingbar] = useState(true);
  const twoCols = nowPlayingbar
    ? {}
    : { gridTemplateColumns: "minmax(284px, 26.25rem) 1fr" };
  const isHidden = nowPlayingbar ? {} : { display: "none" };

  return (
    <section className="home" style={twoCols}>
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
        <button onClick={() => setnowPlayingbar((p) => !p)}>toggle right</button>
      </div>
      <div className="song-view" style={isHidden}>
        <h1>
          right view
          <br />
          song and artist details
        </h1>
      </div>
    </section>
  );
}
