import { Link } from "react-router-dom";

export function YourLibraryPreview({
  _id,
  title,
  type: itemType, // playlist, artist, album, etc.
  createdBy,
  thumbnail,
  isCollapsed,
}) {
  return (
    <Link
      to={`/${itemType}/${_id}`}
      className={`your-library-preview${isCollapsed ? " collapsed" : ""}`}
    >
      <img
        src={thumbnail}
        alt={`${title} thumbnail`}
        className={`your-library-thumbnail${isCollapsed ? " collapsed" : ""}`}
      />
      {!isCollapsed && (
        <div className="your-library-info">
          <h4 className="your-library-title">{title}</h4>
          <p className="your-library-meta">
            {itemType} • {createdBy}
          </p>
        </div>
      )}
    </Link>
  );
}
