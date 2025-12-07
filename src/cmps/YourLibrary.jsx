// components/YourLibrary.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleLibrary } from "../store/actions/system.action";
import {
  loadPlaylists,
  addPlaylist,
} from "../store/actions/playlist.action.js";
import { showErrorMsg } from "../services/event-bus.service.js";
import { playlistService } from "../services/playlist/playlist.service.js";
import { YourLibraryList } from "./YourLibraryList.jsx";
import {
  clearIcon,
  yourLibraryIcon,
  searchIcon,
  sideBarToRightIcon as openLibraryIcon,
  sideBarToLeftIcon as collapseLibraryIcon,
  createIcon,
} from "../services/icon.service.jsx";
import { Navigate } from "react-router";
import { songs } from "../assets/data/songs.js";
import { useCustomScrollbar } from "../customHooks/useCustomScrollbar.jsx";

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
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);
  const navigate = useNavigate();

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

  const { containerRef: libraryListRef, ScrollbarElement } = useCustomScrollbar(
    [filteredItems]
  );

  function handleOnCreatePlaylist() {
    const newPlaylist = playlistService.createPlaylist(
      `My Playlist #${playlists.length + 1}`
    );

    // Save the playlist to storage first, then navigate
    addPlaylist(newPlaylist)
      .then(() => {
        navigate(`/playlist/${newPlaylist._id}`);
        loadPlaylists();
      })
      .catch((err) => {
        console.error("Error creating playlist:", err);
        showErrorMsg("Failed to create playlist");
      });
  }

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
          {!isCollapsed && (
            <>
              <h1 className="library-title">Your Library</h1>
              <button
                className="library-create-btn"
                title="Create a playlist"
                onClick={handleOnCreatePlaylist}
              >
                <span className="library-create-icon">{createIcon({})}</span>
                <span className="library-create-text">Create</span>
              </button>
            </>
          )}
        </div>
      </div>

      {isCollapsed && (
        <div className="library-collapsed-content">
          <button
            className="library-create-btn-collapsed"
            title="Create a playlist"
            onClick={handleOnCreatePlaylist}
          >
            <span className="library-create-icon-collapsed">
              {createIcon({})}
            </span>
          </button>
        </div>
      )}

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

          {/* search and sort/view area */}
          <div className="library-search-sort-view-container">
            <div className="library-search-area">
              {/* show search button only when input is hidden */}
              {!isSearchVisible ? (
                <button
                  type="button"
                  className="library-search-btn"
                  title="Search in Your Library"
                  onClick={() => {
                    setIsSearchVisible(true);
                    setTimeout(() => searchInputRef.current?.focus(), 0);
                  }}
                >
                  {searchIcon({})}
                </button>
              ) : (
                <div
                  className="library-search-wrapper"
                  ref={searchWrapperRef}
                  tabIndex={-1}
                  onBlur={(e) => {
                    const related = e.relatedTarget;
                    if (
                      searchWrapperRef.current &&
                      related &&
                      searchWrapperRef.current.contains(related)
                    )
                      return;
                    setIsSearchVisible(false);
                    setSearchString("");
                  }}
                >
                  <div className="input-with-icon">
                    {/* left icon INSIDE the input wrapper */}
                    <span className="library-search-icon" aria-hidden="true">
                      {searchIcon({})}
                    </span>

                    <input
                      id="library-search"
                      ref={searchInputRef}
                      className="library-search-input"
                      type="text"
                      value={searchString}
                      onChange={(e) => setSearchString(e.target.value)}
                      placeholder="Search in Your Library"
                      autoComplete="off"
                      maxLength={80}
                      aria-label="Type to filter your library. The list of content below will update as you type."
                    />

                    {/* clear shown only when input not empty */}
                    {searchString.length > 0 && (
                      <button
                        type="button"
                        className="library-search-clear"
                        title="Clear search"
                        onClick={() => setSearchString("")}
                      >
                        {clearIcon({})}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <div className="library-list scrollable-container" ref={libraryListRef}>
        {!isLoading ? (
          <YourLibraryList items={filteredItems} isCollapsed={isCollapsed} />
        ) : (
          <div></div>
        )}
      </div>
      {ScrollbarElement}
    </div>
  );
}
