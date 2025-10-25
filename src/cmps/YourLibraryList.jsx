import { YourLibraryPreview } from "./YourLibraryPreview.jsx";

export function YourLibraryList({
  items,
  onRemoveItem,
  onEditItem,
  isCollapsed,
}) {
  return (
    <div className="scrollable-library-list">
      <ul className={`your-library-list ${isCollapsed ? "collapsed" : ""}`}>
        {items.map((item) => (
          <li key={item._id}>
            <YourLibraryPreview {...item} isCollapsed={isCollapsed} />
            {/* <div>
            <button onClick={() => onRemoveItem(item._id)}>x</button>
            <button onClick={() => onEditItem(item)}>Edit</button>
          </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
