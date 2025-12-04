import { HomeButton } from "./HomeButton";
import { ProfileCircle } from "./ProfileCircle";
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
      <div style={{alignContent: "center", marginRight: "0.5rem"}}>
        <ProfileCircle></ProfileCircle>
      </div>
    </header>
  );
}
