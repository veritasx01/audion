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
    <div className="volumebar-container">
      <div className="volumebar" ref={barRef}>
        <div className="bar-container" onMouseDown={handleMouseDown}>
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
  );
}
