import { useEffect, useState } from "react";
import { HomeHeader } from "../cmps/HomeHeader";
import { SongCarousel } from "../cmps/SongCarousel";
import { playlistService } from "../services/playlist/playlist.service";

export function HomePage() {
  const [playlists, setplaylists] = useState([]);
  useEffect(() => {
    const initplaylists = async () => {
      let playlists = await playlistService.query();
      console.log(playlists)
      playlists = playlists.filter((pl) => !pl.isLikedSongs) 
      setplaylists(playlists ? playlists : []);
    };
    initplaylists();
  }, []);

  return (
    <>
      <HomeHeader></HomeHeader>
      <div className="content-view">
        <SongCarousel playlists={playlists} title="Made For You"></SongCarousel>
        <SongCarousel playlists={playlists} title="Jump back in"></SongCarousel>
        <SongCarousel playlists={playlists} title="Recently played"></SongCarousel>
        <SongCarousel
          playlists={playlists}
          title="Recommended for today"
        ></SongCarousel>
      </div>
    </>
  );
}
