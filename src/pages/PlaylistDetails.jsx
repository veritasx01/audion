import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { playlistService } from "../services/playlist.service";

const ALL_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "artist", label: "Artist" },
  { key: "album", label: "Album" },
  { key: "dateAdded", label: "Date Added" },
  { key: "duration", label: "Duration" },
];

export function PlaylistDetails() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [viewMode, setViewMode] = useState("detailed"); // "compact" or "detailed"
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_COLUMNS.map((c) => c.key)
  );

  useEffect(() => {
    playlistService.getById(playlistId).then(setPlaylist);
  }, [playlistId]);

  if (!playlist) return <div>Loading...</div>;

  function toggleColumns(columnKey) {
    setVisibleColumns((columns) =>
      columns.includes(columnKey)
        ? columns.filter((c) => c !== columnKey)
        : [...columns, columnKey]
    );
  }

  function formatSongDuration(totalSeconds) {
    if (!totalSeconds) return "";
    const minutes = Math.floor(totalSeconds / 60);
    const secondsRemainder = totalSeconds % 60;
    return `${minutes}:${secondsRemainder.toString().padStart(2, "0")}`;
  }

  let relevantColumns =
    viewMode === "compact"
      ? ALL_COLUMNS
      : ALL_COLUMNS.filter((c) => c.key !== "artist");

  return (
    <div className="playlist-details">
      {/* Optional blurred thumbnail background */}
      <div
        className="playlist-bg"
        style={{
          background: `url(${playlist.thumbnail}) center/cover no-repeat`,
        }}
      />
      <div className="playlist-header">
        <img
          className="playlist-cover"
          src={playlist.thumbnail}
          alt={playlist.title}
        />
        <div className="playlist-meta">
          <h2>{playlist.title}</h2>
          <h3>{playlist.description}</h3>
          {/* creator & duration */}
          {playlist.songs.length > 0 ? (
            <p>
              {playlist.createdBy} • {playlist.songs.length}{" "}
              {playlist.songs.length > 1 ? "songs" : "song"},{" "}
              {/* Playlist duration */}
              {playlist.duration.hours > 0 && (
                <>
                  {playlist.duration.hours} hr
                  {playlist.duration.hours > 1 ? "s" : ""}{" "}
                </>
              )}
              {playlist.duration.minutes > 0 && (
                <>{playlist.duration.minutes} min </>
              )}
              {playlist.duration.seconds > 0 && (
                <>{playlist.duration.seconds} sec</>
              )}
            </p>
          ) : (
            /* If playlist contains no songs, display just the creator */
            <p>{playlist.createdBy}</p>
          )}
        </div>
      </div>

      {/* Column toggles */}
      <div className="playlist-cols-toggle">
        {relevantColumns.map((column) => (
          <label key={column.key}>
            <input
              type="checkbox"
              checked={visibleColumns.includes(column.key)}
              onChange={() => toggleColumns(column.key)}
            />
            {column.label}
          </label>
        ))}
        {/* Toggle view button */}
        <button
          onClick={() => {
            setViewMode((viewMode) =>
              viewMode === "compact" ? "detailed" : "compact"
            );
          }}
        >
          {viewMode === "compact" ? "Detailed View" : "Compact View"}
        </button>
      </div>
      <div className="playlist-table-wrapper">
        <table className={`playlist-table ${viewMode}`}>
          <thead>
            <tr>
              <th className="song-number-col">#</th>
              {relevantColumns
                .filter((col) => visibleColumns.includes(col.key))
                .map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
              <th></th> {/* Actions column */}
            </tr>
          </thead>
          <tbody>
            {playlist.songs.map((song, idx) => (
              <tr
                key={song._id}
                className={hoveredRow === idx ? "hovered" : ""}
                onMouseEnter={() => setHoveredRow(idx)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="song-number-col">{idx + 1}</td>
                {visibleColumns.includes("title") ? (
                  <td className="playlist-song-title">
                    {viewMode === "detailed" ? (
                      <>
                        <img
                          src={song.thumbnail}
                          alt={song.title}
                          className="song-thumb"
                        />
                        <div>
                          <div className="song-title">{song.title}</div>
                          <div className="song-artist">{song.artist}</div>
                        </div>
                      </>
                    ) : (
                      <span>{song.title}</span>
                    )}
                  </td>
                ) : null}
                {viewMode === "compact" ? (
                  visibleColumns.includes("artist") ? (
                    <td>{song.artist}</td>
                  ) : null
                ) : null}
                {visibleColumns.includes("album") ? (
                  <td>{song.albumName}</td>
                ) : null}
                {visibleColumns.includes("dateAdded") ? (
                  <td>
                    {song.addedAt
                      ? new Date(song.addedAt).toLocaleDateString()
                      : ""}
                  </td>
                ) : null}
                {visibleColumns.includes("duration") ? (
                  <td>
                    {song.duration ? formatSongDuration(song.duration) : ""}
                  </td>
                ) : null}
                <td className="playlist-table-actions">
                  {hoveredRow === idx ? (
                    <div
                      className="playlist-row-actions"
                      style={{
                        opacity: hoveredRow === idx ? 1 : 0,
                        pointerEvents: hoveredRow === idx ? "auto" : "none",
                        transition: "opacity 0.2s",
                      }}
                    >
                      <button className="add-btn" title="Add to playlist">
                        {/* Plus SVG */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <rect
                            x="7"
                            y="2"
                            width="2"
                            height="12"
                            rx="1"
                            fill="currentColor"
                          />
                          <rect
                            x="2"
                            y="7"
                            width="12"
                            height="2"
                            rx="1"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                      <button className="menu-btn" title="More">
                        {/* Three dots SVG */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <circle cx="3" cy="8" r="1.5" fill="currentColor" />
                          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                          <circle cx="13" cy="8" r="1.5" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
