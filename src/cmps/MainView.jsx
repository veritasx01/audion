import { Routes, Route } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { HomePage } from "../pages/HomePage";
import { toggleLibrary } from "../store/actions/system.action";

export function MainView() {
  const nowPlayingView = useSelector(
    (state) => state.systemModule.nowPlayingView
  );
  const libraryView = useSelector((state) => state.systemModule.libraryView);
  const twoCols = nowPlayingView ? {} : { gridTemplateColumns: "auto 1fr" };
  const isHidden = nowPlayingView ? {} : { display: "none" };
  const dispatch = useDispatch();
  const toggleLib = () => {
    dispatch(toggleLibrary());
  };

  return (
    <section className="home" style={twoCols}>
      <div className={libraryView ? "library-view" : "library-view mini"}>
        <button onClick={toggleLib}>mini</button>
        <h1>
          left view,
          <br />
          library view
        </h1>
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
