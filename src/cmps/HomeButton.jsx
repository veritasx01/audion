import { useLocation, useNavigate } from "react-router";

export function HomeButton() {
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  if (path === "/") {
    return (
      <button className="home-button hov-enlarge">
        <span className="size-24">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="white">
            <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732z"></path>
          </svg>
        </span>
      </button>
    );
  }

  return (
    <button className="home-button hov-enlarge" onClick={goHome}>
      <span className="size-24">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="#a0a0a0">
          <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732z"></path>
        </svg>
      </span>
    </button>
  );
}