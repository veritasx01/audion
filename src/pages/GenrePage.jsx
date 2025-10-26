export function GenrePage() {
  return (
    <section className="genre-section">
      <h1>Browse All</h1>
      <div className="genres-container">
        {genreCard(
          "https://i.scdn.co/image/ab67fb8200005caf474a477debc822a3a45c5acb",
          "Music",
          "rgb(220, 20, 140)"
        )}
        {genreCard(
          "https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa",
          "Podcasts",
          "rgb(0, 100, 80)"
        )}
        {genreCard(
          "https://concerts.spotifycdn.com/images/live-events_category-image.jpg",
          "Live Events",
          "rgb(132, 0, 231)"
        )}
        {genreCard(
          "https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/topic/pop/1McMsnEElThX1knmY4oliG/en",
          "Made For You",
          "rgb(30, 50, 100)"
        )}
        {genreCard(
          "https://i.scdn.co/image/ab67fb8200005caf194fec0fdc197fb9e4fe8e64",
          "New Releases",
          "rgb(96, 129, 8)"
        )}
        {genreCard(
          "https://i.scdn.co/image/ab67fb8200005caf66d545e6a69d0bfe8bd1e825",
          "Pop",
          "rgb(71, 125, 149)"
        )}
        {genreCard(
          "https://i.scdn.co/image/ab67fb8200005caf5f3752b3234e724f9cd6056f",
          "Hip-Hop",
          "rgb(71, 125, 149)"
        )}
        {genreCard(
          "https://i.scdn.co/image/ab67fb8200005cafda4c849095796a9e5d2c4ddb",
          "Rock",
          "rgb(0, 100, 80)"
        )}
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
