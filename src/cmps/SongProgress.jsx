import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export function SongProgress() {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const progressRef = useRef(null);
  const duration = useSelector((state) => state.songModule.currentDuration);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);

  useEffect(() => {
    if (!isPlaying) return;
    let start = Date.now();
    let initialProgress = progress;

    const tick = () => {
      const elapsed = (Date.now() - start) / 1000;
      const newProgress = Math.min(
        (elapsed * 100) / duration + initialProgress,
        100
      );
      setProgress(newProgress);
      if (newProgress < 100 && isPlaying) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isPlaying, duration, progress]);

  const updateVolumeFromClientX = (clientX) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(0, Math.min(100, newPos));
    setProgress(newPos);
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

  const secsPassed = (progress * duration) / 100;
  return (
    <div className="progress-container">
      <div className="playback-position">
        {Math.floor(secsPassed / 60)}:{Math.floor(secsPassed % 60)}
      </div>
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
