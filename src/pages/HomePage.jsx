import { useEffect, useState } from "react";
import { HomeHeader } from "../cmps/HomeHeader";
import { SongCarousel } from "../cmps/SongCarousel";
import { playlistService } from "../services/playlist/playlist.service";
import { shuffleArray } from "../services/util.service";

export function HomePage() {
  const [playlists, setplaylists] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const initplaylists = async () => {
      let playlistsQuery = await playlistService.query();
      playlistsQuery = playlistsQuery.filter((pl) => !pl.isLikedSongs);
      setplaylists(playlistsQuery ? playlistsQuery : []);
      setLists([
        playlists,
        shuffleArray(playlists),
        shuffleArray(playlists),
        shuffleArray(playlists),
      ]);
    };
    initplaylists();
  }, []);

  return (
    <>
      <HomeHeader></HomeHeader>
      <div className="content-view">
        <SongCarousel playlists={lists[0]} title="Made For You"></SongCarousel>
        <SongCarousel playlists={lists[1]} title="Jump back in"></SongCarousel>
        <SongCarousel
          playlists={lists[2]}
          title="Recently played"
        ></SongCarousel>
        <SongCarousel
          playlists={lists[3]}
          title="Recommended for today"
        ></SongCarousel>
      </div>
    </>
  );
}
