import { useParams } from "react-router";
import { SearchHeader } from "../cmps/SearchHeader";

export function SearchPage() {
  const { searchWord } = useParams();
  return (
    <div>
      <SearchHeader searchWord={searchWord}></SearchHeader>
    </div>
  );
}
