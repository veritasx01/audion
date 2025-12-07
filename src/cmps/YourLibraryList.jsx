import { YourLibraryPreview } from "./YourLibraryPreview.jsx";

export function YourLibraryList({ items, isCollapsed }) {
  return (
    <ul className={`your-library-list ${isCollapsed ? "collapsed" : ""}`}>
      {items.map((item) => (
        <li key={item._id}>
          <YourLibraryPreview {...item} isCollapsed={isCollapsed} />
        </li>
      ))}
    </ul>
  );
}
