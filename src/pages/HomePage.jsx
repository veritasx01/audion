import { useEffect, useState } from "react";
import { HomeHeader } from "../cmps/HomeHeader";
import { SongCarousel } from "../cmps/SongCarousel";
import { songService } from "../services/song/song.service";

export function HomePage() {
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    const initSongs = async () => {
      const queried = await songService.query();
      setSongs(queried);
    };
    initSongs();
  }, []);

  return (
    <>
      <HomeHeader></HomeHeader>
      <div className="content-view">
        <SongCarousel songs={songs} title="Made For You"></SongCarousel>
        <SongCarousel songs={songs} title="Jump back in"></SongCarousel>
        <SongCarousel songs={songs} title="Recently played"></SongCarousel>
        <SongCarousel
          songs={songs}
          title="Recommended for today"
        ></SongCarousel>
      </div>
    </>
  );
}
