import { useLocation, useNavigate } from "react-router";
import homeFilledIcon from "../assets/icons/home-filled.svg";
import homeOutlineIcon from "../assets/icons/home-outline.svg";

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
          <img src={homeFilledIcon} alt="Home icon" />
        </span>
      </button>
    );
  }

  return (
    <button className="home-button hov-enlarge" onClick={goHome}>
      <span className="size-24">
        <img src={homeOutlineIcon} alt="Home icon" />
      </span>
    </button>
  );
}
