import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCurrentSong } from "../store/actions/song.action";

export function VolumeBar() {
  const [volume, setVolume] = useState(50);
  const [dragging, setDragging] = useState(false);
  const barRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateCurrentSong({ volume }));
  }, [volume, dispatch]);

  const updateVolumeFromClientX = (clientX) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(0, Math.min(100, newPos));
    setVolume(newPos);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    updateVolumeFromClientX(e.clientX);

    const onMove = (moveEvent) => updateVolumeFromClientX(moveEvent.clientX);

    const onUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <>
      <button className="controls-button hov-enlarge">
        <span className="size-32" aria-hidden="true">
          {getCurrentVolSvg(volume)}
        </span>
      </button>
      <div className="volumebar-container" onMouseDown={handleMouseDown}>
        <div className="volumebar" ref={barRef}>
          <div className="bar-container">
            <div
              className={`bar ${dragging ? "active" : ""}`}
              style={{ transform: `translateX(calc(-100% + ${volume}%))` }}
            ></div>
          </div>
          <div
            className="ball"
            onMouseDown={handleMouseDown}
            style={{
              left: `calc(${volume}% - 6px)`,
              display: dragging ? "block" : undefined,
              cursor: "pointer",
            }}
          ></div>
        </div>
      </div>
    </>
  );
}

function getCurrentVolSvg(volume) {
  if (volume > 66) {
    return (
      <svg viewBox="0 0 16 16" fill="#b2b2b2">
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88"></path>
        <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127z"></path>
      </svg>
    );
  } else if (volume > 33) {
    return (
      <svg viewBox="0 0 16 16" fill="#b2b2b2">
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a3 3 0 0 1 0 5.175z"></path>
      </svg>
    );
  } else {
    return (
      <svg viewBox="0 0 16 16" fill="#b2b2b2">
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88"></path>
      </svg>
    );
  }
}
