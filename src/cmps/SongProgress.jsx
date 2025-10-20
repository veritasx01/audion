import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatTimeFromSecs } from "../services/util.service";

export function SongProgress() {
  const [progress, SetProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const progressRef = useRef(null);
  const duration = useSelector((state) => state.songModule.currentDuration);
  const song = useSelector((state) => state.songModule.currentSong);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);

  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSecs((prev) => {
        SetProgress(((prev + 1) / duration) * 100);
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    setSecs(0);
  }, [song]);

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
      <div className="playback-position">{formatTimeFromSecs(secs)}</div>
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
      <div className="playback-duration">{formatTimeFromSecs(duration)}</div>
    </div>
  );
}
