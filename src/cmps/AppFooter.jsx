import { PlayerControls } from "./PlayerControls";
import { SongControls } from "./SongControls";

export function AppFooter() {
  return (
    <footer className="app-footer full">
      <p>should contain music details</p>
      <PlayerControls></PlayerControls>
      <SongControls></SongControls>
    </footer>
  );
}
