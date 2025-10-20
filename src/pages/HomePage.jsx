import { songs } from "../assets/data/songs";
import { SongList } from "../cmps/SongList";

export function HomePage() {
  return (
    <>
      <SongList songs={songs} />
    </>
  );
}