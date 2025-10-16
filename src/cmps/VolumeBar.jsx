import { useState, useRef, useEffect } from "react";

export function VolumeBar() {
  return (
    <div className="volumebar-container">
      <div className="volumebar">
        <div className="bar-container">
          <div className="bar"></div>
        </div>
        <div className="ball"></div>
      </div>
    </div>
  );
}
