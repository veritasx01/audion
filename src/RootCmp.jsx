import { AppHeader } from "./cmps/AppHeader";
import { AppFooter } from "./cmps/AppFooter";
import { UserMsg } from "./cmps/UserMsg.jsx";
import { MainView } from "./cmps/MainView.jsx";
import { GlobalPlayer } from "./cmps/GlobalPlayer.jsx";
import { updateCurrentSong } from "./store/actions/song.action.js";

export function RootCmp() {
  updateCurrentSong({
    currentDuration: 318,
    currentSong: "https://www.youtube.com/watch?v=3mbBbFH9fAg",
  });
  return (
    <div className="main-container">
      <GlobalPlayer />
      <AppHeader />
      <UserMsg />
      <main>
        <MainView />
      </main>
      <AppFooter />
    </div>
  );
}
