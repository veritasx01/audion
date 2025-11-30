export const utilService = {
  makeId,
  makeLorem,
  getRandomIntInclusive,
  randomPastTime,
  debounce,
  saveToStorage,
  loadFromStorage,
  sortColorsByBrightness,
};

export function makeId(length = 16) {
  var txt = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}

export function makeLorem(size = 100) {
  var words = [
    "The sky",
    "above",
    "the port",
    "was",
    "the color of television",
    "tuned",
    "to",
    "a dead channel",
    ".",
    "All",
    "this happened",
    "more or less",
    ".",
    "I",
    "had",
    "the story",
    "bit by bit",
    "from various people",
    "and",
    "as generally",
    "happens",
    "in such cases",
    "each time",
    "it",
    "was",
    "a different story",
    ".",
    "It",
    "was",
    "a pleasure",
    "to",
    "burn",
  ];
  var txt = "";
  while (size > 0) {
    size--;
    txt += words[Math.floor(Math.random() * words.length)] + " ";
  }
  return txt;
}

export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomPastTime() {
  const hour = 1000 * 60 * 60;
  const week = 1000 * 60 * 60 * 24 * 7;
  const pastTime = getRandomIntInclusive(hour, week);
  return Date.now() - pastTime;
}

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : undefined;
}

function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return match ? match[1] : null;
}
const key = import.meta.env.VITE_YOUTUBE_API_KEY;
export async function fetchYouTubeDuration(videoUrl, apiKey = key) {
  if (!videoUrl || videoUrl === "") return 0;
  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) throw new Error("Invalid YouTube URL");

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`
  );
  const data = await response.json();

  const isoDuration = data.items?.[0]?.contentDetails?.duration;
  if (!isoDuration) throw new Error("Duration not found");

  // Convert ISO 8601 duration (e.g., PT4M13S) → seconds
  return isoDurationToSeconds(isoDuration);
}

function isoDurationToSeconds(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

export function getRandomValues(arr, m = 1) {
  if (m > arr.length) {
    throw new Error("m cannot be larger than array length");
  }

  const indices = Array.from({ length: arr.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]; // shuffle
  }

  return indices.slice(0, m).map((i) => arr[i]);
}

export function formatTimeFromSecs(secs) {
  secs = Math.floor(secs);
  const minutes = String(Math.floor(secs / 60));
  const seconds = String(secs % 60).padStart(2, "0");
  const formattedTime = `${minutes}:${seconds}`;
  return formattedTime;
}

export function sortColorsByBrightness(colors) {
  if (colors?.length > 0) {
    return colors
      .slice(0, 5) // Get more colors to choose from
      .map((color) => ({
        hex: color.hex || color,
        brightness: _calculateBrightness(color.hex || color),
      }))
      .sort((a, b) => a.brightness - b.brightness) // Sort darkest first
      .slice(0, 3) // Take top 3
      .map((color) => color.hex)
      .reverse(); // Reverse so lightest is first in gradient

    console.log("Final colors for gradient (light to dark):", sortedColors);
  }

  // Utill function for calculate color brightness using luminance formula
  function _calculateBrightness(hexColor) {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Using relative luminance formula (ITU-R BT.709)
    return r * 0.2126 + g * 0.7152 + b * 0.0722;
  }
}
