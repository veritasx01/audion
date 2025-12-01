export const iconService = {
  sideBarToLeftIcon,
  sideBarToRightIcon,
  yourLibraryIcon,
  clearIcon,
  searchIcon,
  playIcon,
  pauseIcon,
  meatBallMenuIcon,
  copyIcon,
  addToQueueIcon,
  editDetailsIcon,
  deleteIcon,
  enableShuffleIcon,
  disableShuffleIcon,
  durationIcon,
};

// icon for collapsing a left side bar or expanding a right side bar
export function sideBarToLeftIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox={viewBox || "0 0 16 16"}
      height={height || "16"}
      width={width || "16"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M10.97 5.47a.75.75 0 1 1 1.06 1.06L10.56 8l1.47 1.47a.75.75 0 1 1-1.06 1.06l-2-2a.75.75 0 0 1 0-1.06z"></path>
      <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zm.5 1.5H5v13H1.5zm13 13h-8v-13h8z"></path>
    </svg>
  );
}

// icon for expanding a left side bar or collapsing a right side bar
export function sideBarToRightIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox={viewBox || "0 0 24 24"}
      height={height || "24"}
      width={width || "24"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M14.457 15.207a1 1 0 0 1-1.414-1.414L14.836 12l-1.793-1.793a1 1 0 0 1 1.414-1.414l2.5 2.5a1 1 0 0 1 0 1.414z"></path>
      <path d="M20 22a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zM4 20V4h4v16zm16 0H10V4h10z"></path>
    </svg>
  );
}

// icon for "Your Library" side bar when it is collapsed and not hovered or focused
export function yourLibraryIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      height={height || "24"}
      width={width || "24"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866M16 4.732V20h4V7.041zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1m6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1"></path>
    </svg>
  );
}

// an "X" icon for clearing input fields
export function clearIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      data-encore-id="icon"
      role="img"
      aria-hidden="true"
      viewBox="0 0 16 16"
      height={height || "16"}
      width={width || "16"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M2.47 2.47a.75.75 0 0 1 1.06 0L8 6.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L9.06 8l4.47 4.47a.75.75 0 1 1-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 0 1-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 0 1 0-1.06"></path>
    </svg>
  );
}

// magnifying glass icon for search input fields
export function searchIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 16 16"
      height={height || "16"}
      width={width || "16"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M7 1.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5M.25 7a6.75 6.75 0 1 1 12.096 4.12l3.184 3.185a.75.75 0 1 1-1.06 1.06L11.304 12.2A6.75 6.75 0 0 1 .25 7"></path>
    </svg>
  );
}

export function playIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox={viewBox || "0 0 24 24"}
      height={height || "16"}
      width={width || "16"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
    </svg>
  );
}

export function pauseIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      height={height || "16"}
      width={width || "16"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7z"></path>
    </svg>
  );
}

export function meatBallMenuIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox={viewBox || "0 0 24 24"}
      height={height || "24"}
      width={width || "24"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m15 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
    </svg>
  );
}

export function copyIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 16 16"
      height={height || "24"}
      width={width || "24"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M5 .75A.75.75 0 0 1 5.75 0h9.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H12v-1.5h2.5v-9h-8V3H5z"></path>
      <path d="M.75 4a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h9.5a.75.75 0 0 0 .75-.75V4.75a.75.75 0 0 0-.75-.75zm.75 10.5v-9h8v9z"></path>
    </svg>
  );
}

export function addToQueueIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 16 16"
      height={height || "24"}
      width={width || "24"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M16 15H2v-1.5h14zm0-4.5H2V9h14zm-8.034-6A5.5 5.5 0 0 1 7.187 6H13.5a2.5 2.5 0 0 0 0-5H7.966c.159.474.255.978.278 1.5H13.5a1 1 0 1 1 0 2zM2 2V0h1.5v2h2v1.5h-2v2H2v-2H0V2z"></path>
      ;
    </svg>
  );
}

export function editDetailsIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 16 16"
      height={height || "24"}
      width={width || "24"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M11.838.714a2.438 2.438 0 0 1 3.448 3.448l-9.841 9.841c-.358.358-.79.633-1.267.806l-3.173 1.146a.75.75 0 0 1-.96-.96l1.146-3.173c.173-.476.448-.909.806-1.267l9.84-9.84zm2.387 1.06a.94.94 0 0 0-1.327 0l-9.84 9.842a1.95 1.95 0 0 0-.456.716L2 14.002l1.669-.604a1.95 1.95 0 0 0 .716-.455l9.841-9.841a.94.94 0 0 0 0-1.327z"></path>
      ;
    </svg>
  );
}

export function deleteIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 16 16"
      height={height || "24"}
      width={width || "24"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M5 8h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function enableShuffleIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      height={height || "24"}
      width={width || "24"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M18.788 3.702a1 1 0 0 1 1.414-1.414L23.914 6l-3.712 3.712a1 1 0 1 1-1.414-1.414L20.086 7h-1.518a5 5 0 0 0-3.826 1.78l-7.346 8.73a7 7 0 0 1-5.356 2.494H1v-2h1.04a5 5 0 0 0 3.826-1.781l7.345-8.73A7 7 0 0 1 18.569 5h1.518l-1.298-1.298z" />
      <path d="M18.788 14.289a1 1 0 0 0 0 1.414L20.086 17h-1.518a5 5 0 0 1-3.826-1.78l-1.403-1.668-1.306 1.554 1.178 1.4A7 7 0 0 0 18.568 19h1.518l-1.298 1.298a1 1 0 1 0 1.414 1.414L23.914 18l-3.712-3.713a1 1 0 0 0-1.414 0zM7.396 6.49l2.023 2.404-1.307 1.553-2.246-2.67a5 5 0 0 0-3.826-1.78H1v-2h1.04A7 7 0 0 1 7.396 6.49" />
    </svg>
  );
}

export function disableShuffleIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 24 24"
      height={height || "24"}
      width={width || "24"}
      fill={fill || "#b3b3b3"}
      stroke={stroke || "none"}
    >
      <path d="M7.335.6a.667.667 0 0 0-1.327 0c-.083.86-.457 2.21-1.309 3.386C3.86 5.142 2.567 6.126.6 6.333a.667.667 0 0 0 0 1.327c1.967.207 3.26 1.19 4.099 2.347.851 1.176 1.227 2.527 1.307 3.386a.666.666 0 0 0 1.329 0c.08-.86.456-2.21 1.307-3.386.839-1.156 2.132-2.14 4.099-2.348a.667.667 0 0 0 0-1.326c-1.967-.207-3.26-1.191-4.1-2.347C7.792 2.81 7.417 1.459 7.336.6Zm11.979 6.186a1 1 0 0 1 1.415-1.414l3.211 3.211-3.212 3.211a1 1 0 0 1-1.414-1.414l.797-.797h-.862a4 4 0 0 0-3.06 1.425l-6.122 7.275a7.3 7.3 0 0 1-1.383 1.279c-.51.352-1.178.685-1.905.685v-2c.137 0 .4-.077.768-.331.35-.242.7-.577.99-.921l6.12-7.275a6 6 0 0 1 4.592-2.137h.863z" />
      <path d="M19.249 19.584a6 6 0 0 1-4.591-2.137l-.771-.917-.006-.007-.003-.003-.016-.02-.06-.07a2 2 0 0 0-.118-.12l1.289-1.53a3.3 3.3 0 0 1 .42.433l.028.035.007.007.76.904a4 4 0 0 0 3.06 1.425h.84l-.798-.797a1 1 0 0 1 1.414-1.415l3.212 3.212-3.212 3.211a1 1 0 1 1-1.414-1.414l.797-.797z" />
    </svg>
  );
}

export function durationIcon({ height, width, fill, stroke, viewBox }) {
  return (
    <svg
      role="img"
      aria-hidden="true"
      viewBox="0 0 16 16"
      height={height || "16"}
      width={width || "16"}
      fill={fill || "currentColor"}
      stroke={stroke || "none"}
    >
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
      <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25"></path>
    </svg>
  );
}
