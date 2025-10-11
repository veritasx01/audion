import { HomeButton } from "./HomeButton";
import { SearchBar } from "./SearchBar";

export function AppHeader() {
  return (
    <header className="app-header full">
      <div>
        <p>logo goes here</p>
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
