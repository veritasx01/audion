import { useParams } from "react-router";

export function SearchPage() {
  const { searchWord } = useParams();
  return (
    <div>
      <h1>{searchWord}</h1>
      <h1>Top result</h1>
      <h1>Artists</h1>
      <h1>Albums</h1>
      <h1>Playlists</h1>
    </div>
  );
}
