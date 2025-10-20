import { Routes, Route } from "react-router";
import { useSelector } from "react-redux";
import { HomePage } from "../pages/HomePage";
import { YourLibrary } from "./YourLibrary";

export function MainView() {
  const nowPlayingView = useSelector(
    (state) => state.systemModule.nowPlayingView
  );
  const libraryView = useSelector((state) => state.systemModule.libraryView);
  const twoCols = nowPlayingView ? {} : { gridTemplateColumns: "auto 1fr" };
  const isHidden = nowPlayingView ? {} : { display: "none" };

  return (
    <section className="home" style={twoCols}>
      <div className={libraryView ? "library-view" : "library-view mini"}>
        <YourLibrary />
      </div>
      <div className="main-view">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
