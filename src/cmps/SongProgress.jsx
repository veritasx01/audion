import { useRef, useState } from "react";
import { useSelector } from "react-redux";

export function SongProgress() {
  const [progress, SetProgress] = useState(50);
  const [dragging, setDragging] = useState(false);
  const progressRef = useRef(null);
  const duration = useSelector((state) => state.songModule.currentDuration);

  const updateVolumeFromClientX = (clientX) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(0, Math.min(100, newPos));
    SetProgress(newPos);
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
    <div className="progress-container">
      <div className="playback-position">00:00</div>
      <div className="progress-bar-container" onMouseDown={handleMouseDown}>
        <div className="progress-bar" ref={progressRef}>
          <div className="bar-container">
            <div
              className={`bar ${dragging ? "active" : ""}`}
              style={{ transform: `translateX(calc(-100% + ${progress}%))` }}
            ></div>
          </div>
          <div
            className="ball"
            style={{
              left: `calc(${progress}% - 6px)`,
              display: dragging ? "block" : undefined,
              cursor: "pointer",
            }}
            onMouseDown={handleMouseDown}
          ></div>
        </div>
      </div>
      <div className="playback-duration">
        {Math.floor(duration / 60)}:{duration % 60}
      </div>
    </div>
  );
}
