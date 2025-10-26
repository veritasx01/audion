// components/YourLibrary.jsx
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLibrary } from "../store/actions/system.action";
import { loadPlaylists } from "../store/actions/playlist.action.js";
import { showErrorMsg } from "../services/event-bus.service.js";
import { playlistService } from "../services/playlist.service.js";
import { YourLibraryList } from "./YourLibraryList.jsx";
import {
  clearIcon,
  yourLibraryIcon,
  searchIcon,
  sideBarToRightIcon as openLibraryIcon,
  sideBarToLeftIcon as collapseLibraryIcon,
} from "../services/icon.service.jsx";

// TODO: add support for artists, albums & optionaly podcasts
export function YourLibrary() {
  const dispatch = useDispatch();
  const [itemTypeFilter, setItemTypeFilter] = useState("All");
  const [searchString, setSearchString] = useState("");
  const playlists = useSelector((store) => store.playlistModule.playlists);
  const libraryItems = useMemo(
    () => playlists.map((playlist) => ({ ...playlist, type: "Playlist" })),
    [playlists]
  );
  const isLoading = useSelector((store) => store.playlistModule.isLoading);
  const isCollapsed = !useSelector((store) => store.systemModule.libraryView);

  useEffect(() => {
    loadPlaylists().catch((err) => {
      showErrorMsg("Cannot load playlists!");
    });
  }, [itemTypeFilter, searchString]);

  const filteredItems = isLoading
    ? []
    : libraryItems.filter((item) => {
        const itemTypeMatches =
          itemTypeFilter === "All" || itemTypeFilter.includes(item.type);
        const searchStringMatches =
          item.title?.toLowerCase().includes(searchString) ||
          item.description?.toLowerCase().includes(searchString) ||
          item.createdBy?.toLowerCase().includes(searchString);

        return itemTypeMatches && searchStringMatches;
      });

  return (
    <div className={`library-container ${isCollapsed ? "collapsed" : ""}`}>
      <div className="library-header">
        {/* header left side for toggle button and title */}
        <div className="library-header-left">
          <button
            className="library-toggle-btn"
            onClick={() => dispatch(toggleLibrary())}
            title={`${isCollapsed ? "Open" : "Collapse"} Your Library`}
            aria-label="Toggle library"
          >
            {/* Always render all three — CSS decides which is visible */}
            <span className="icon-library">{yourLibraryIcon({})}</span>
            <span className="icon-open">{openLibraryIcon({})}</span>
            <span className="icon-collapse">
              {collapseLibraryIcon({ fill: "#aaa" })}
            </span>
          </button>
          {!isCollapsed && <h1 className="library-title">Your Library</h1>}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* filter controlls */}
          <div className="library-filters">
            {/* show clear icon only when a filter other than "All" is active */}
            {itemTypeFilter !== "All" && (
              <button
                className="filter-clear-btn"
                onClick={() => setItemTypeFilter("All")}
                aria-label="Clear filter"
                title="Clear filter"
              >
                <span className="filter-clear-icon">{clearIcon({})}</span>
              </button>
            )}

            {/* Render filter buttons */}
            {["Playlists", "Artists", "Albums"].map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${
                  itemTypeFilter === filter ? "active" : ""
                }`}
                onClick={() => setItemTypeFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="library-search-sort-view-container">
            <div className="library-search-container">
              <span className="search-icon">{searchIcon({})}</span>
              <input
                type="text"
                className="library-search-input"
                placeholder="Search your library"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value.toLowerCase())}
                aria-label="Search your library"
              />
            </div>
          </div>
        </>
      )}
      <div className="library-list">
        {!isLoading ? (
          <YourLibraryList items={filteredItems} isCollapsed={isCollapsed} />
        ) : (
          <div>Loading your library...</div>
        )}
      </div>
    </div>
  );
}
