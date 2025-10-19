import searchIcon from "../assets/icons/search.svg";
import browseIcon from "../assets/icons/browse.svg";

export function SearchBar() {
  return (
    <form
      className="search-form flex align-center"
      style={{ position: "relative" }}
    >
      {/* search button */}
      <span
        className="size-48 flex justify-center align-center"
        style={{ position: "absolute" }}
      >
        <img src={searchIcon} alt="Search icon" />
      </span>
      <input
        className="main-searchbar"
        type="text"
        placeholder="What do you want to play?"
      ></input>
      {/* browse button */}
      <div
        className="size-48 flex justify-center align-center"
        style={{ position: "absolute", right: "0px" }}
      >
        <img src={browseIcon} alt="Browse icon" />
      </div>
    </form>
  );
}
