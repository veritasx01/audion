import { useEffect, useState } from "react";
import { HomeHeader } from "../cmps/HomeHeader";
import { SongCarousel } from "../cmps/SongCarousel";
import { playlistService } from "../services/playlist/playlist.service";
import { shuffleArray } from "../services/util.service";
import { Loader } from "../cmps/Loader";

export function HomePage() {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const initplaylists = async () => {
      let playlistsQuery = await playlistService.query({});
      playlistsQuery = playlistsQuery.filter((pl) => !pl.isLikedSongs && pl.songs.length > 0);
      const finalData = playlistsQuery ? playlistsQuery : [];
      console.log("final data:", finalData);
      setLists([
        finalData,
        shuffleArray(finalData),
        shuffleArray(finalData),
        shuffleArray(finalData),
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
        {console.log("lists in render:", lists[0])}
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
