import { useLocation, useNavigate } from "react-router";

export function SearchBar() {
  const path = useLocation().pathname;
  const navigate = useNavigate();

  const goSearch = () => {
    navigate("/search");
  };

  return (
    <form
      className="search-form flex align-center"
      style={{ position: "relative" }}
    >
      {/* search button */}
      <span
        className="size-48 flex justify-center align-center"
        style={{ position: "absolute" }}
      >
        {searchIcon()}
      </span>
      <input
        className="main-searchbar"
        type="text"
        placeholder="What do you want to play?"
      ></input>
      {/* browse button */}
      <div
        className="size-48 flex justify-center align-center"
        style={{ position: "absolute", right: "0px" }}
        onClick={goSearch}
      >
        {browseIcon(path.startsWith("/search"))}
      </div>
    </form>
  );
}

function browseIcon(isSearch) {
  if (isSearch) {
    return (
      <svg className="size-24" viewBox="0 0 24 24" fill="#a0a0a0">
        <path d="M4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4H4zM1.513 9.37A1 1 0 0 1 2.291 9H21.71a1 1 0 0 1 .978 1.208l-2.17 10.208A2 2 0 0 1 18.562 22H5.438a2 2 0 0 1-1.956-1.584l-2.17-10.208a1 1 0 0 1 .201-.837zM12 17.834c1.933 0 3.5-1.044 3.5-2.333s-1.567-2.333-3.5-2.333S8.5 14.21 8.5 15.5s1.567 2.333 3.5 2.333z"></path>
      </svg>
    );
  }

  return (
    <svg className="size-24" viewBox="0 0 24 24" fill="#a0a0a0">
      <path d="M15 15.5c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2"></path>
      <path d="M1.513 9.37A1 1 0 0 1 2.291 9h19.418a1 1 0 0 1 .979 1.208l-2.339 11a1 1 0 0 1-.978.792H4.63a1 1 0 0 1-.978-.792l-2.339-11a1 1 0 0 1 .201-.837zM3.525 11l1.913 9h13.123l1.913-9zM4 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4h-2V3H6v3H4z"></path>
    </svg>
  );
}

function searchIcon() {
  return (
    <svg className="size-24" viewBox="0 0 24 24" fill="#a0a0a0">
      <path d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z"></path>
    </svg>
  );
}
