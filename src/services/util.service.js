export const utilService = {
  makeId,
  makeLorem,
  getRandomIntInclusive,
  randomPastTime,
  debounce,
  saveToStorage,
  loadFromStorage,
  sortColorsByBrightness,
  updateRgbaColorsAlpha,
  escapeRegexSpecialCharacters,
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

export function getRandomExcept(min, max, except) {
  if (except < min || except > max) {
    return getRandomIntInclusive(min, max);
  }

  if (max - min === 0 && min === except) {
    console.error("Range only contains the excluded number.");
    return null;
  }

  let random = getRandomIntInclusive(min, max);
  if (random >= except) {
    random += 1;
  }

  return random;
}

export function getRandomExcept(min, max, except) {
  if (except < min || except > max) {
    return getRandomIntInclusive(min, max);
  }

  if (max - min === 0 && min === except) {
    console.error("Range only contains the excluded number.");
    return null;
  }

  let random = getRandomIntInclusive(min, max);
  if (random >= except) {
    random += 1;
  }

  return random;
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

/* this function takes an array of rgba color strings and updates their alpha value 
for example: ['rgba(0,0,0,255)', 'rgba(107,171,207,255)', 'rgba(71,35,35,255)'] which
is received from color extraction util with an invalid alpha value, 
and updates the alpha to a normalized value */
export function updateRgbaColorsAlpha(rgbaColors, newAlpha) {
  return rgbaColors.map((color) => {
    // Extract numbers inside rgba(...)
    let parts = color.match(/\d+/g).map(Number);
    // Replace alpha (last value) with normalized alpha (0–1)
    parts[3] = newAlpha;
    return `rgba(${parts[0]},${parts[1]},${parts[2]},${parts[3]})`;
  });
}

// Helper function to calculate brightness by summing RGB values
function _calculateBrightness(color) {
  let r, g, b;

  // Handle both hex and rgba formats
  if (color.startsWith("#")) {
    // Hex format
    const hex = color.replace("#", "");
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith("rgba(")) {
    // RGBA format - extract RGB values
    const matches = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (matches) {
      r = parseInt(matches[1], 10);
      g = parseInt(matches[2], 10);
      b = parseInt(matches[3], 10);
    } else {
      return 0; // fallback
    }
  } else {
    return 0; // fallback for unknown formats
  }

  // Simple RGB sum approach - higher sum = brighter color
  return r + g + b;
}

export function sortColorsByBrightness(colors, maxColorsToReturn = 3) {
  if (!colors || colors.length === 0) return [];

  const sortedColors = colors
    .slice(0, maxColorsToReturn) // Get more colors to choose from
    .map((color) => ({
      original: color.hex || color,
      brightness: _calculateBrightness(color.hex || color),
    }))
    .sort((a, b) => b.brightness - a.brightness) // Sort brightest first
    .slice(0, maxColorsToReturn) // Take top 3
    .map((color) => color.original);
  return sortedColors;
}

// array utils

export function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export function shuffleArray(array) {
  const arrayCopy = [...array];

  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }

  return arrayCopy;
}

export function getShuffledIndexArray(length) {
  let arr = [];
  for (let i = 0; i < length; i++) arr.push(i);
  return shuffleArray(arr);
}

export function shuffleArray(array) {
  const arrayCopy = [...array];

  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }

  return arrayCopy;
}

export function getShuffledIndexArray(length) {
  let arr = [];
  for (let i = 0; i < length; i++) arr.push(i);
  return shuffleArray(arr);
}

// Helper function to escape regex special characters
export function escapeRegexSpecialCharacters(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
