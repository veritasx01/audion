import { AppHeader } from "./cmps/AppHeader";
import { AppFooter } from "./cmps/AppFooter";
import { UserMsg } from "./cmps/UserMsg.jsx";
import { MainView } from "./cmps/MainView.jsx";
import { GlobalPlayer } from "./cmps/GlobalPlayer.jsx";

export function RootCmp() {
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
