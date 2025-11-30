import { useEffect, useRef, useState } from "react";

export function ContextMenu({
  isVisible,
  position,
  onClose,
  menuItems = [],
  className = "",
}) {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClose]);

  // Adjust position to keep menu within viewport
  const getAdjustedPosition = () => {
    if (!menuRef.current || !position) return position;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let { x, y } = position;

    // Adjust horizontal position if menu would overflow
    if (x + rect.width > viewport.width) {
      x = viewport.width - rect.width - 8; // 8px margin
    }
    if (x < 8) {
      x = 8;
    }

    // Adjust vertical position if menu would overflow
    if (y + rect.height > viewport.height) {
      y = viewport.height - rect.height - 8; // 8px margin
    }
    if (y < 8) {
      y = 8;
    }

    return { x, y };
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    onClose();
  };

  if (!isVisible) return null;

  const adjustedPosition = getAdjustedPosition();

  return (
    <>
      {/* Backdrop for mobile/touch devices */}
      <div className="context-menu-backdrop" onClick={onClose} />

      <ul
        ref={menuRef}
        className={`context-menu ${className}`}
        style={{
          position: "fixed",
          top: adjustedPosition?.y || 0,
          left: adjustedPosition?.x || 0,
          zIndex: 10000,
        }}
      >
        {menuItems.map((item, index) => {
          // Separator item
          if (item.type === "separator") {
            return <li key={index} className="context-menu-separator" />;
          }

          // Regular menu item
          return (
            <li
              key={item.id || index}
              className={`context-menu-item ${
                item.disabled ? "disabled" : ""
              } ${item.danger ? "danger" : ""}`}
              onClick={() => !item.disabled && handleItemClick(item)}
            >
              {item.icon && (
                <span className="context-menu-icon">{item.icon}</span>
              )}
              <span className="context-menu-text">{item.label}</span>
              {item.shortcut && (
                <span className="context-menu-shortcut">{item.shortcut}</span>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

// Hook for easier usage
export function useContextMenu() {
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    items: [],
  });

  const showContextMenu = (event, menuItems) => {
    if (event.preventDefault) event.preventDefault();
    if (event.stopPropagation) event.stopPropagation();

    setContextMenu({
      isVisible: true,
      position: { x: event.clientX, y: event.clientY + 8 },
      items: menuItems,
    });
  };

  const hideContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, isVisible: false }));
  };

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu,
  };
}
