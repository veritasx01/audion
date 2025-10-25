// components/YourLibrary.jsx
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleLibrary } from "../store/actions/system.action";
import { loadPlaylists } from "../store/actions/playlist.action.js";
import { showErrorMsg } from "../services/event-bus.service.js";
import { playlistService } from "../services/playlist.service.js";
import { YourLibraryList } from "./YourLibraryList.jsx";
import {
  sideBarToRightIcon as openLibraryIcon,
  sideBarToLeftIcon as collapseLibraryIcon,
  yourLibraryIcon,
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
        <div className="library-header-left">
          <button
            className="library-toggle"
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
          {!isCollapsed && <h3 className="library-title">Your Library</h3>}
        </div>
      </div>

      {!isCollapsed && (
        <>
          <input
            type="text"
            placeholder="Search in Your Library"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value.toLowerCase())}
            className="library-search"
          />

          <div className="library-filters">
            {["All", "Playlists", "Artists", "Albums"].map((f) => (
              <button
                key={f}
                className={itemTypeFilter === f ? "active" : ""}
                onClick={() => setItemTypeFilter(f)}
              >
                {f}
              </button>
            ))}
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
