import { useEffect, useState } from "react";
import { HomeHeader } from "../cmps/HomeHeader";
import { SongCarousel } from "../cmps/SongCarousel";
import { playlistService } from "../services/playlist/playlist.service";
import { Loader } from "../cmps/Loader";

export function HomePage() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const initplaylists = async () => {
      let playlistsQuery = await playlistService.query({});
      const finalData = playlistsQuery ? playlistsQuery : [];
      setLists([
        finalData.slice(0,12),
        finalData.slice(12,24),
        finalData.slice(24,36),
        finalData.slice(36,48),
      ]);
    };
    initplaylists();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lists || lists.length === 0) {
    return <Loader></Loader>
  } 

  return (
    <>
      <HomeHeader></HomeHeader>
      <div className="content-view">
        <SongCarousel playlists={lists[0]} title="Made For You"></SongCarousel>
        <SongCarousel playlists={lists[1]} title="Discover picks for you"></SongCarousel>
        <SongCarousel
          playlists={lists[2]}
          title="Recommended for today"
        ></SongCarousel>
        <SongCarousel
          playlists={lists[3]}
          title="Your top mixes"
        ></SongCarousel>
      </div>
    </>
  );
}
