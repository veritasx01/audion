import { PlayerControls } from "./PlayerControls";

export function AppFooter() {
  return (
    <footer className="app-footer full">
      <p>should contain music details</p>
      <PlayerControls></PlayerControls>
      <p style={{ textAlign: "right" }}>should contain audio controls</p>
    </footer>
  );
}
