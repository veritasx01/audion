import { songs } from "../assets/data/songs";
import { SongCarousel } from "../cmps/SongCarousel";

export function HomePage() {
  return (
    <>
      <div className="gradient-header">
      </div>
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
