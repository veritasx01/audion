import { useEffect, useRef, useState } from "react";

export function ContextMenu({
  isVisible,
  position,
  onClose,
  menuItems = [],
  className = "",
}) {
  const menuRef = useRef(null);
  const submenuTimeoutRef = useRef(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });

  // Reset submenu state when context menu visibility changes
  useEffect(() => {
    if (isVisible) {
      setActiveSubmenu(null);
    } else {
      // Clear timeout when menu closes
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    }
  }, [isVisible]);

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
    // Don't close menu if item has submenu
    if (item.submenu) {
      return;
    }

    if (item.onClick) {
      item.onClick();
    }
    onClose();
  };

  const handleItemHover = (item, index, event) => {
    // Clear any existing timeout
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }

    if (item.submenu) {
      const itemRect = event.currentTarget.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Calculate available space below the item
      const spaceBelow = viewport.height - itemRect.top - 20; // 20px margin from bottom

      // Estimate submenu item height (32px per item + padding)
      const estimatedItemHeight = 32;
      const estimatedSubmenuHeight =
        item.submenu.length * estimatedItemHeight + 8; // 8px for padding

      // Determine if we need to limit height and enable scrolling
      const maxAllowedHeight = Math.min(300, spaceBelow); // Don't exceed 300px or available space
      const needsScrolling = estimatedSubmenuHeight > maxAllowedHeight;

      setSubmenuPosition({
        x: itemRect.left - 170, // Slightly more space to prevent overlap
        y: itemRect.top,
        maxHeight: needsScrolling ? maxAllowedHeight : undefined,
      });
      setActiveSubmenu(index);
    } else {
      setActiveSubmenu(null);
    }
  };

  const handleItemLeave = () => {
    // Clear any existing timeout
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }

    // Set timeout to hide submenu - longer delay for better UX
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 600);
  };
  const handleSubmenuEnter = () => {
    // Clear timeout when mouse enters submenu
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
  };

  const handleSubmenuLeave = () => {
    setActiveSubmenu(null);
  };

  const handleSubmenuItemClick = (subItem) => {
    if (subItem.onClick) {
      subItem.onClick();
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
              } ${item.danger ? "danger" : ""} ${
                item.submenu ? "has-submenu" : ""
              }`}
              onClick={() => !item.disabled && handleItemClick(item)}
              onMouseEnter={(e) => handleItemHover(item, index, e)}
              onMouseLeave={handleItemLeave}
            >
              {item.icon && (
                <span className="context-menu-icon">{item.icon}</span>
              )}
              <span className="context-menu-text">{item.label}</span>
              {item.submenu && <span className="context-menu-arrow">▶</span>}
              {item.shortcut && (
                <span className="context-menu-shortcut">{item.shortcut}</span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Submenu */}
      {activeSubmenu !== null && menuItems[activeSubmenu]?.submenu && (
        <ul
          className="context-menu context-submenu"
          style={{
            position: "fixed",
            top: submenuPosition.y,
            left: submenuPosition.x,
            zIndex: 10001,
            maxHeight: submenuPosition.maxHeight
              ? `${submenuPosition.maxHeight}px`
              : "300px",
          }}
          onMouseEnter={handleSubmenuEnter}
          onMouseLeave={handleSubmenuLeave}
        >
          {menuItems[activeSubmenu].submenu.map((subItem, subIndex) => (
            <li
              key={subItem.id || subIndex}
              className={`context-menu-item ${
                subItem.disabled ? "disabled" : ""
              } ${subItem.danger ? "danger" : ""}`}
              onClick={() =>
                !subItem.disabled && handleSubmenuItemClick(subItem)
              }
            >
              {subItem.icon && (
                <span className="context-menu-icon">{subItem.icon}</span>
              )}
              <span className="context-menu-text">{subItem.label}</span>
            </li>
          ))}
        </ul>
      )}
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
