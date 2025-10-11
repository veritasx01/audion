import { useState } from "react";
import { Routes, Route } from "react-router";
import { TestPage } from "../pages/TestPage";

export function MainView() {
  const [nowPlayingbar, setnowPlayingbar] = useState(true);
  const [libraryBar, setLibraryBar] = useState(true);
  const twoCols = nowPlayingbar ? {} : { gridTemplateColumns: "auto 1fr" };
  const isHidden = nowPlayingbar ? {} : { display: "none" };
  const toggleNowPlaying = () => setnowPlayingbar((p) => !p);

  return (
    <section className="home" style={twoCols}>
      <div className={libraryBar ? "library-view" : "library-view mini"}>
        <button onClick={() => setLibraryBar((p) => !p)}>mini</button>
        <h1>
          left view,
          <br />
          library view
        </h1>
      </div>
      <div className="main-view">
        <Routes>
          <Route path="/" element={<TestPage toggle={toggleNowPlaying} />} />
        </Routes>
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
