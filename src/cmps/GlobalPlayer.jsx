import { useSelector, useDispatch } from 'react-redux';
import ReactPlayer from 'react-player';
import {
  setAudioEnded,
  updateCurrentSong,
  togglePlaying,
  updateSecs,
} from '../store/actions/song.action';
import { useEffect, useRef } from 'react';
import { goToNextSong } from '../store/actions/songQueue.action';

export function GlobalPlayer() {
  const playerRef = useRef(null);
  const isPlaying = useSelector((state) => state.songModule.isPlaying);
  const volume = useSelector((state) => state.songModule.volume);
  const globalSong = useSelector((state) => state.songModule.currentSong);
  const secs = useSelector((state) => state.songModule.secs);
  const ended = useSelector((state) => state.songModule.hasEnded);
  const songQueue = useSelector((state) => state.songQueueModule.songQueue);
  const index = useSelector((state) => state.songQueueModule.currentIndex);
  const dispatch = useDispatch();

  useEffect(() => {
    if (ended && songQueue.length > 0) {
      dispatch(goToNextSong());
    }
  }, [ended, dispatch, songQueue.length]);

  useEffect(() => {
    if (index === songQueue.length && songQueue.length > 0) {
      dispatch(togglePlaying());
      return;
    }
    if (songQueue && songQueue.length > 0) {
      const nextSong = songQueue[index];
      if (nextSong) {
        dispatch(setAudioEnded(false));
        dispatch(updateCurrentSong(nextSong));
      }
    }
  }, [index, songQueue, dispatch]);

  useEffect(() => {
    if (playerRef.current?.api?.seekTo) {
      playerRef.current.api.seekTo(secs, 'seconds');
    }
  }, [secs]);

  return (
    <div>
      <div className="global-player-container">
        <ReactPlayer
          ref={playerRef}
          src={globalSong.url}
          playing={ended ? false : isPlaying}
          volume={volume}
          loop={false}
          onReady={() => dispatch(updateSecs(0)) /* reset player when ready */}
          onEnded={() => dispatch(setAudioEnded(true))}
        />
      </div>
    </div>
  );
}
