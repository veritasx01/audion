import { songs } from "../assets/data/songs";
import { SongCarousel } from "../cmps/SongCarousel";

export function HomePage() {
  return (
    <>
      <SongCarousel songs={songs}></SongCarousel>
      <SongCarousel songs={songs}></SongCarousel>
      <SongCarousel songs={songs}></SongCarousel>
      <SongCarousel songs={songs}></SongCarousel>
      <SongCarousel songs={songs}></SongCarousel>
      <SongCarousel songs={songs}></SongCarousel>
    </>
  );
}