import { YourLibraryPreview } from "./YourLibraryPreview.jsx";

export function YourLibraryList({ items, isCollapsed }) {
  return (
    <div
      className={`scrollable-library-list ${isCollapsed ? "collapsed" : ""}`}
    >
      <ul className={`your-library-list ${isCollapsed ? "collapsed" : ""}`}>
        {items.map((item) => (
          <li key={item._id}>
            <YourLibraryPreview {...item} isCollapsed={isCollapsed} />
          </li>
        ))}
      </ul>
    </div>
  );
}
