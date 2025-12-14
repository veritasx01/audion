import { useParams } from "react-router";
import { SearchHeader } from "../cmps/SearchHeader";
import { useEffect, useState } from "react";
import { playlistService } from "../services/playlist/playlist.service";
import {SongCarousel} from "../cmps/SongCarousel"

export function SearchPage() {
  const { searchWord } = useParams();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const loadPlaylists = async () => {
      let playlistsQuery = await playlistService.query({
        freeText: searchWord,
      });
      playlistsQuery = playlistsQuery.filter((pl) => !pl.isLikedSongs);
      setPlaylists(playlistsQuery);
    };
    loadPlaylists();
  }, [searchWord]);

  return (
    <div>
      <SearchHeader searchWord={searchWord}></SearchHeader>
      <div className="search-playlists-container">
        <h2>Playlists</h2>
        {/*<SongCarousel playlists={playlists.slice(0,5)}></SongCarousel>*/}
      </div>
    </div>
  );
}
