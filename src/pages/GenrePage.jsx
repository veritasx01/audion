import { genreArray } from "../assets/data/genre";

export function GenrePage() {
  return (
    <section className="genre-section">
      <h1>Browse All</h1>
      <div className="genres-container">
        {genreArray.map((g) => genreCard(g.img, g.title, g.bg))}
      </div>
    </section>
  );
}

function genreCard(imgSrc, title, backgroundColor = "rgb(0,0,0)") {
  return (
    <div style={{ padding: "12px" }}>
      <div
        className="genre-card-container"
        style={{ background: backgroundColor }}
      >
        <a draggable="false">
          <div>
            <img
              className="card-image"
              draggable="false"
              loading="lazy"
              src={imgSrc}
              alt=""
            />
            <span className="genre-header" title="Music">
              <span>{title}</span>
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
