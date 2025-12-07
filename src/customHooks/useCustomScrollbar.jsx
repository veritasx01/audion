import { useRef, useEffect } from "react";

/**
 * Custom hook for Spotify-style overlay scrollbar
 * @param {Array} dependencies - Dependencies to trigger scrollbar recalculation
 * @param {Object} options - Configuration options
 * @returns {Object} - Refs and JSX element for the scrollbar
 */
export function useCustomScrollbar(dependencies = [], options = {}) {
  const {
    thumbHeight = 240,
    scrollbarWidth = 12,
    hideTimeout = 1000,
    scrollingClass = "scrolling",
  } = options;

  const containerRef = useRef(null);
  const scrollbarRef = useRef(null);
  const scrollThumbRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout;

    const handleScroll = () => {
      const thumb = scrollThumbRef.current;
      const scrollbar = scrollbarRef.current;
      if (!thumb || !scrollbar) return;

      // Add scrolling class for visibility
      container.classList.add(scrollingClass);

      // Position scrollbar to match container
      const rect = container.getBoundingClientRect();
      Object.assign(scrollbar.style, {
        position: "fixed",
        top: `${rect.top}px`,
        height: `${rect.height}px`,
        left: `${rect.right - scrollbarWidth}px`,
      });

      // Calculate thumb position
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll > 0) {
        const scrollPercent = scrollTop / maxScroll;
        const availableHeight = rect.height - thumbHeight;
        const thumbPosition = scrollPercent * availableHeight;

        thumb.style.transition = "top 0.1s ease-out";
        thumb.style.top = `${thumbPosition}px`;

        // Add appropriate border radius based on position
        if (scrollPercent < 0.05) {
          // At top edge - round top corners
          thumb.classList.add("at-top-edge");
          thumb.classList.remove("at-bottom-edge");
        } else if (scrollPercent > 0.95) {
          // At bottom edge - round bottom corners
          thumb.classList.add("at-bottom-edge");
          thumb.classList.remove("at-top-edge");
        } else {
          // In middle - square corners
          thumb.classList.remove("at-top-edge", "at-bottom-edge");
        }
      }

      // Hide scrollbar after timeout
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        container.classList.remove(scrollingClass);
      }, hideTimeout);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial position

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, dependencies);

  // Scrollbar JSX element
  const ScrollbarElement = (
    <div className="custom-scrollbar" ref={scrollbarRef}>
      <div className="custom-scrollbar-track"></div>
      <div className="custom-scrollbar-thumb" ref={scrollThumbRef}></div>
    </div>
  );

  return {
    containerRef,
    scrollbarRef,
    scrollThumbRef,
    ScrollbarElement,
  };
}
