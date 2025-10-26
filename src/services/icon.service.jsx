export const iconService = {
  sideBarToLeftIcon,
  sideBarToRightIcon,
  yourLibraryIcon,
  clearIcon,
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
