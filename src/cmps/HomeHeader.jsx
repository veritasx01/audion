export function HomeHeader() {
  return (
    <div className="gradient-header">
      <div className="playlist-card-wrapper">
        <div className="playlist-card-container">
          <PlaylistCard></PlaylistCard>
          <PlaylistCard></PlaylistCard>
          <PlaylistCard></PlaylistCard>
          <PlaylistCard></PlaylistCard>
          <PlaylistCard></PlaylistCard>
          <PlaylistCard></PlaylistCard>
          <PlaylistCard></PlaylistCard>
          <PlaylistCard></PlaylistCard>
        </div>
      </div>
    </div>
  );
}

function PlaylistCard() {
  return <div className="playlist-card"></div>;
}
