import { PlayerControls } from "./PlayerControls";
import { SongControls } from "./SongControls";
import { SongWidget } from "./SongWidget";

export function AppFooter() {
  return (
    <footer className="app-footer full">
      <SongWidget></SongWidget>
      <PlayerControls></PlayerControls>
      <SongControls></SongControls>
    </footer>
  );
}
