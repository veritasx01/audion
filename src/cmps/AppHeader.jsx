import { HomeButton } from "./HomeButton";
import { SearchBar } from "./SearchBar";

export function AppHeader() {
  return (
    <header className="app-header full">
      <div className="flex align-center">
        <img
          style={{ width: "32px", height: "32px", marginLeft: "28px" }}
          src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
        ></img>
      </div>
      <div className="flex row">
        <HomeButton />
        <SearchBar />
      </div>
      <div>
        <p>nav goes here</p>
      </div>
    </header>
  );
}
