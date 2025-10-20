import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { formatTimeFromSecs } from "../services/util.service";
import { updateSongObject } from "../store/actions/song.action";

export function SongProgress() {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const progressRef = useRef(null);
  const duration = useSelector((state) => state.songModule.currentDuration);
  const song = useSelector((state) => state.songModule.currentSong);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);

  const [secs, setSecs] = useState(0);
  let animationFrameId = useRef(null);

  useEffect(() => {
    if (!isPlaying) return;

    let startTime = performance.now();

    const tick = (now) => {
      const elapsed = (now - startTime) / 1000; // seconds
      setSecs(elapsed);
      setProgress((elapsed / duration) * 100);

      animationFrameId.current = requestAnimationFrame(tick);
    };

    animationFrameId.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isPlaying, duration]);

  useEffect(() => {
    setSecs(0);
    setProgress(0);
  }, [song]);

  const updateVolumeFromClientX = (clientX) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(0, Math.min(100, newPos));
    const newSecs = Math.round((newPos * duration) / 100);
    const newProg = Math.round((newSecs / duration) * 100); // lock to seconds
    setSecs(newSecs);
    setProgress(newProg);
    updateSongObject({ secs: newSecs });
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
