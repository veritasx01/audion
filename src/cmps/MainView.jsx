import { Routes, Route } from 'react-router';
import { useSelector } from 'react-redux';
import { HomePage } from '../pages/HomePage';
import { YourLibrary } from './YourLibrary';
import { PlaylistDetails } from '../pages/PlaylistDetails';
import { GenrePage } from '../pages/GenrePage';
import { SearchPage } from '../pages/SearchPage';
import { NowPlayingView } from './NowPlayingView';

export function MainView() {
  const nowPlayingView = useSelector(
    (state) => state.systemModule.nowPlayingView
  );
  const currentSong = useSelector((state) => state.songModule.currentSong);
  const libraryView = useSelector((state) => state.systemModule.libraryView);
  const twoCols = nowPlayingView ? {} : { gridTemplateColumns: 'auto 1fr' };
  const isHidden = nowPlayingView ? {} : { display: 'none' };

  return (
    <section className="home" style={twoCols}>
      <div className={libraryView ? 'library-view' : 'library-view mini'}>
        <YourLibrary />
      </div>
      <div className="main-view">
        <div className="os-scroll-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
            <Route path="/search" element={<GenrePage />} />
            <Route path="/search/:searchWord?" element={<SearchPage />} />
          </Routes>
        </div>
      </div>
      <div className="song-view" style={isHidden || currentSong}>
        <NowPlayingView songObj={currentSong}></NowPlayingView>
      </div>
    </section>
  );
}
