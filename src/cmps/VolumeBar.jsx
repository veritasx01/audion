import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateVolume } from "../store/actions/song.action";
import lowVolumeIcon from "../assets/icons/volume-low.svg";
import midVolumeIcon from "../assets/icons/volume-mid.svg";
import highVolumeIcon from "../assets/icons/volume-high.svg";

export function VolumeBar() {
  const [volume, setVolume] = useState(100);
  const [dragging, setDragging] = useState(false);
  const barRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateVolume(volume / 100));
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
    return <img src={highVolumeIcon} alt="High volume icon" />;
  } else if (volume > 33) {
    return <img src={midVolumeIcon} alt="Medium volume icon" />;
  } else {
    return <img src={lowVolumeIcon} alt="Low volume icon" />;
  }
}
