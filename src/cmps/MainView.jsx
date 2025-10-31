import { Routes, Route } from "react-router";
import { useSelector } from "react-redux";
import { HomePage } from "../pages/HomePage";
import { YourLibrary } from "./YourLibrary";
import { PlaylistDetails } from "../pages/PlaylistDetails";
import { GenrePage } from "../pages/GenrePage";
import { SearchPage } from "../pages/SearchPage";

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
          <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
          <Route path="/search" element={<GenrePage />} />
          <Route path="/search/:searchWord?" element={<SearchPage />} />
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
