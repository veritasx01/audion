import { useState, useEffect, useRef } from "react";
import { SongCard } from "./SongCard";

const SCROLL_PX = 585;

export function SongCarousel({ playlists = [], title = "" }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setCanScrollLeft(scrollLeft > 0);

      // buffer for pixel rounding issues on some screens
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  // Check buttons on mount and resize
  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [playlists.length]);

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });

      setTimeout(checkScrollButtons, 500);
    }
  };

  const leftStyle = canScrollLeft ? {} : { display: "none" };
  const rightStyle = canScrollRight ? {} : { display: "none" };

  return (
    <div className="carousel-inner" style={{ overflow: "hidden" }}>
      {title !== "" ? (
        <h2 className="carousel-title">
          <a>{title}</a>
        </h2>
      ) : null}
      <button
        className="left-button carousel-button hov-enlarge"
        onClick={() => scroll(-SCROLL_PX)}
        style={{ ...leftStyle }}
      >
        {leftArrow()}
      </button>
      <div
        className="song-carousel-container"
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
      >
        <div className="song-carousel">
          {playlists.map((playlist, idx) => (
            <SongCard playlist={playlist} key={idx} />
          ))}
        </div>
      </div>
      <button
        className="right-button carousel-button hov-enlarge"
        style={{ ...rightStyle }}
        onClick={() => scroll(SCROLL_PX)}
      >
        {rightArrow()}
      </button>
    </div>
  );
}

function leftArrow() {
  return (
    <span className="size-16">
      <svg viewBox="0 0 16 16" fill="#b2b2b2">
        <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0"></path>
      </svg>
    </span>
  );
}

function rightArrow() {
  return (
    <span className="size-16">
      <svg viewBox="0 0 16 16" fill="#b2b2b2">
        <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0"></path>
      </svg>
    </span>
  );
}
