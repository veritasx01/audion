import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatTimeFromSecs } from '../services/util.service';
import { updateSecs } from '../store/actions/song.action';

export function SongProgress() {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const progressRef = useRef(null);
  const duration = useSelector(
    (state) => state.songModule.currentSong.duration
  );
  const songUrl = useSelector((state) => state.songModule.currentSong.url);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);
  const dispatch = useDispatch();

  const [secs, setSecs] = useState(0);
  let animationFrameId = useRef(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = secs;
      return;
    }
    if (dragging) return;

    let startTime = performance.now();

    const tick = (now) => {
      const elapsed = (now - startTime) / 1000; // seconds
      const updatedSecs = lastTimeRef.current + elapsed;

      if (updatedSecs >= duration) {
        setSecs(duration);
        setProgress(100);
        cancelAnimationFrame(animationFrameId.current);
        lastTimeRef.current = duration;
        return; // stop ticking
      }

      setSecs(updatedSecs);
      setProgress((updatedSecs / duration) * 100);

      animationFrameId.current = requestAnimationFrame(tick);
    };

    animationFrameId.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, duration, dragging]);

  useEffect(() => {
    setSecs(0);
    setProgress(0);
    lastTimeRef.current = 0;
  }, [songUrl]);

  const updateProgressFromClientX = (clientX) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    newPos = Math.max(0, Math.min(100, newPos));
    const newSecs = (newPos * duration) / 100;
    const newProg = (newSecs / duration) * 100; // lock to seconds
    setSecs(newSecs);
    setProgress(newProg);
    lastTimeRef.current = newSecs;
    dispatch(updateSecs(newSecs));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    updateProgressFromClientX(e.clientX);

    const onMove = (moveEvent) => updateProgressFromClientX(moveEvent.clientX);

    const onUp = () => {
      setDragging(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div className="progress-container">
      <div className="playback-position">{formatTimeFromSecs(secs)}</div>
      <div className="progress-bar-container" onMouseDown={handleMouseDown}>
        <div className="progress-bar" ref={progressRef}>
          <div className="bar-container">
            <div
              className={`bar ${dragging ? 'active' : ''}`}
              style={{
                transform: songUrl
                  ? `translateX(calc(-100% + ${progress}%))`
                  : `translateX(calc(-100%))`,
              }}
            ></div>
          </div>
          <div
            className="ball"
            style={{
              left: songUrl ? `calc(${progress}% - 6px)` : `calc(0% - 6px)`,
              display: dragging ? 'block' : undefined,
              cursor: 'pointer',
            }}
            onMouseDown={handleMouseDown}
          ></div>
        </div>
      </div>
      <div className="playback-duration">{formatTimeFromSecs(duration)}</div>
    </div>
  );
}
