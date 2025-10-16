import { useState, useRef } from "react";

export function VolumeBar() {
  const [volume, setVolume] = useState(50);
  const [dragging, setDragging] = useState(false);
  const barRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);

    const onMove = (moveEvent) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      let newPos = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      newPos = Math.max(0, Math.min(100, newPos));
      setVolume(newPos);
    };

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
        <div className="bar-container">
          <div
            className="bar"
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
