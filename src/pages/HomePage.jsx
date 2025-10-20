import { useDispatch } from "react-redux";
import { songs } from "../assets/data/songs";
import { updateCurrentSong } from "../store/actions/song.action";

export function HomePage() {
  return (
    <>
      <SongList songs={songs} />
    </>
  );
}

function SongList({ songs }) {
  const dispatch = useDispatch();
  const changeToSong = (url) => {
    dispatch(updateCurrentSong(url));
  };

  return (
    <>
      {songs.map((pl) => (
        <div key={1}>
          <p key={1}>{pl.title}</p>
          <button onClick={() => changeToSong(pl.url)}>
            change player to song
          </button>
        </div>
      ))}
    </>
  );
}
