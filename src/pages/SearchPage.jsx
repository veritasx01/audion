import { useParams } from "react-router";
import { SearchHeader } from "../cmps/SearchHeader";
import { useEffect, useState } from "react";
import { playlistService } from "../services/playlist/playlist.service";
import { SongCarousel } from "../cmps/SongCarousel";
import { Loader } from "../cmps/Loader.jsx";
import { songService } from "../services/song/song.service.js";

export function SearchPage() {
  const { searchWord } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPlaylists = async () => {
      setIsLoading(true);
      let playlistsQuery = await playlistService.query({
        freeText: searchWord,
      });
      let songsQuery = await songService.query({ freeText: searchWord });
      playlistsQuery = playlistsQuery.filter((pl) => !pl.isLikedSongs);
      setPlaylists(playlistsQuery);
      setSongs(songsQuery);
      setIsLoading(false);
    };
    loadPlaylists();
  }, [searchWord]);
  
  if(isLoading) {
    return <Loader></Loader>
  }

  return (
    <div>
      <SearchHeader songs={songs}></SearchHeader>
      <div className="search-playlists-container">
        <h2>Playlists</h2>
        <SongCarousel playlists={playlists.slice(0, 5)}></SongCarousel>
      </div>
    </div>
  );
}
