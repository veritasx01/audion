import { storageService } from "../async-storage.service.js";
import { userService } from "../user/user.service.js";
import { makeId, utilService } from "../util.service.js";
import { faker } from "@faker-js/faker";
import { songs } from "../../assets/data/songs.js";
import defaultThumbnail from "../../assets/images/default-playlist-thumbnail.svg";
import likedSongsThumbnail from "../../assets/images/liked-songs-playlist-thumbnail.svg";

export const playlistService = {
  createPlaylist,
  createLikedSongsCollectionForUser,
  addSong,
  removeSong,
  getById,
  query,
  save,
  remove,
  formatPlaylistDuration,
};

const STORAGE_KEY = "playlistsDB";

// Initialize playlists in storage if not present
_createPlaylists();

// create a new playlist
function createPlaylist(
  title = faker.lorem.words({ min: 2, max: 6 }),
  description = faker.lorem.sentence(),
  createdBy = faker.person.fullName(),
  createdAt = new Date(),
  songs = []
) {
  // add the current date as addedAt for each song
  const playlistSongs = songs.map((song) => ({ ...song, addedAt: new Date() }));

  // Use first song's thumbnail if available, otherwise use default musical note thumbnail
  const thumbnail = playlistSongs[0]?.thumbnail || _getDefaultThumbnail();

  const newPlaylist = {
    //_id: utilService.makeId(), // would be added by backend service
    title,
    description,
    createdBy,
    createdAt,
    songs: playlistSongs,
    thumbnail,
  };
  return newPlaylist;
}

// add song to a playlist
function addSong(playlistId, song) {
  const newSong = { ...song, addedAt: new Date() };
  return getById(playlistId).then((playlist) => {
    playlist.songs.push(newSong);
    return save(playlist);
  });
}

// remove song from a playlist
function removeSong(playlistId, songId) {
  return getById(playlistId).then((playlist) => {
    playlist.songs = playlist.songs.filter((song) => song._id !== songId);
    return save(playlist);
  });
}

// query playlists from storage with optional filtering by title or description
function query(filterBy) {
  return storageService
    .query(STORAGE_KEY)
    .then((playlists) => {
      // filter by playlists created by specific user
      if (filterBy?.userId) {
        playlists = playlists.filter(
          (playlist) => playlist.createdBy?._id === filterBy.userId
        );
      }
      // filter by playlist IDs if provided (array of playlist IDs)
      if (filterBy?.playlistIds && Array.isArray(filterBy.playlistIds)) {
        playlists = playlists.filter((playlist) =>
          filterBy.playlistIds.includes(playlist._id)
        );
      }
      // filter by artist name in playlist songs
      if (filterBy?.artist) {
        // TBD support artist ID when artists are implemented
        playlists = playlists.filter((playlist) =>
          playlist.songs?.some(
            (song) =>
              song.artist.toLowerCase() === filterBy.artist.toLowerCase()
          )
        );
      }
      // filter by free text in title, description or createdBy
      if (filterBy?.freeText) {
        let { freeText } = filterBy;
        const regexExpression = new RegExp( // // Create regex for word boundary matching (case insensitive)
          `\\b${utilService.escapeRegexSpecialCharacters(freeText)}\\b`, // word boundary
          "i"
        ); // case insensitive);
        playlists = playlists.filter((playlist) =>
          playlist.songs?.some(
            (song) =>
              regexExpression.test(song.title) ||
              regexExpression.test(song.artist) ||
              regexExpression.test(song.albumName)
          )
        );
      }
      return playlists;
    })
    .catch((error) => {
      console.log("Error retrieving playlists:", error);
      throw error;
    });
}

// get playlist by id from storage
function getById(id) {
  return storageService.get(STORAGE_KEY, id);
}

// delete playlist from storage
function remove(id) {
  return storageService.remove(STORAGE_KEY, id);
}

// save playlist to storage (add new or update existing)
function save(playlistToSave) {
  if (playlistToSave._id) {
    return storageService.put(STORAGE_KEY, playlistToSave);
  } else {
    return storageService.post(STORAGE_KEY, playlistToSave);
  }
}

function createLikedSongsCollectionForUser(user) {
  const likedSongsPlaylist = createPlaylist(
    "Liked Songs",
    "Your collection of liked songs",
    user,
    new Date(),
    []
  );
  likedSongsPlaylist.thumbnail = likedSongsThumbnail;
  likedSongsPlaylist.isLikedSongs = true; // special flag to identify liked songs playlist
  return likedSongsPlaylist;
}

// util function for formatting total duration of playlist songs
export function formatPlaylistDuration(playlist) {
  const totalDurationSeconds = playlist.songs.reduce(
    (acc, song) => acc + song.duration,
    0
  );
  const hours = Math.floor(totalDurationSeconds / 3600);
  const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
  const seconds = totalDurationSeconds % 60;
  const hoursStr = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""} ` : "";
  const minutesStr = minutes > 0 ? `${minutes} min ` : "";
  const secondsStr = seconds > 0 ? `${seconds} sec` : "";
  return `${hoursStr}${minutesStr}${secondsStr}`.trim();
}

// Get default playlist thumbnail with musical note icon
function _getDefaultThumbnail() {
  return defaultThumbnail;
}

// get playlists from storage or generate dummy data if none exist
function _createPlaylists() {
  let demoPlaylists = utilService.loadFromStorage(STORAGE_KEY);
  if (!demoPlaylists || !demoPlaylists.length) {
    demoPlaylists = [];
    songs.sort(() => Math.random() - 0.5); // Shuffle the songs
    const rapSongs = songs.filter((song) => song.genres.includes("rap"));
    const rockSongs = songs.filter((song) => song.genres.includes("rock"));
    const popSongs = songs.filter((song) => song.genres.includes("pop"));
    const jazzSongs = songs.filter((song) => song.genres.includes("jazz"));
    const bluesSongs = songs.filter((song) => song.genres.includes("blues"));
    const beatlesSongs = songs.filter((s) => s.artist.includes("Beatles"));
    const eltonJohnSongs = songs.filter((s) => s.artist.includes("Elton John"));
    const psychedelicRockSongs = songs.filter(
      (s) => s.genres.includes("rock") && s.genres.includes("psychedelic")
    );
    const countrySongs = songs.filter((song) =>
      song.genres.includes("country")
    );
    const houseSongs = songs.filter((song) => song.genres.includes("house"));

    // create demo users
    const defaultUser = userService.getDefaultUser();

    const user1 = {
      _id: makeId(),
      username: "user1",
      fullName: "Alice Johnson",
      email: "alice@example.com",
      profileImg: `https://randomuser.me/api/portraits/thumb/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    };

    const user2 = {
      _id: makeId(),
      username: "user2",
      fullName: "Bob Smith",
      email: "bob@example.com",
      profileImg: `https://randomuser.me/api/portraits/thumb/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    };

    const user3 = {
      _id: makeId(),
      username: "user3",
      fullName: "Charlie Brown",
      email: "charlie@example.com",
      profileImg: `https://randomuser.me/api/portraits/thumb/men/${Math.floor(
        Math.random() * 100
      )}.jpg`,
    };

    const demoUsers = [defaultUser, user1, user2, user3];

    demoPlaylists.push(
      createPlaylist(
        "Pop Hits",
        "Top pop songs",
        defaultUser,
        new Date(),
        popSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );
    demoPlaylists.push(
      createPlaylist(
        "Jazz Vibes",
        "Smooth jazz tunes",
        user1,
        new Date(),
        jazzSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    demoPlaylists.push(
      createPlaylist(
        "Blues Essentials",
        "Classic blues tracks",
        user1,
        new Date(),
        bluesSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    demoPlaylists.push(
      createPlaylist(
        "The Beatles Collection",
        "Hits from The Beatles and solo works",
        user2,
        new Date(),
        beatlesSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    demoPlaylists.push(
      createPlaylist(
        "Elton John Greatest Hits",
        "Hits from Elton John",
        user2,
        new Date(),
        eltonJohnSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    demoPlaylists.push(
      createPlaylist(
        "Psychedelic Rock",
        "Trippy and mind-bending rock tunes",
        user2,
        new Date(),
        psychedelicRockSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    demoPlaylists.push(
      createPlaylist(
        "Country Roads",
        "Best of country music",
        user3,
        new Date(),
        countrySongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    demoPlaylists.push(
      createPlaylist(
        "House Party",
        "Upbeat house music tracks",
        user3,
        new Date(),
        houseSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    demoPlaylists.push(
      createPlaylist(
        "Rap Hits",
        "Top rap songs",
        user3,
        new Date(),
        rapSongs.map((song) => ({ ...song, addedAt: new Date() }))
      )
    );

    demoPlaylists.forEach((playlist) => {
      playlist._id = utilService.makeId();
    });

    // save playlists to storage
    utilService.saveToStorage(STORAGE_KEY, demoPlaylists);

    demoUsers.forEach(
      (user) =>
        (user.library = {
          playlists: demoPlaylists
            .filter((p) => p.createdBy._id === user._id)
            .map((p) => p._id),
        }) && userService.save(user)
    );
  }
  return demoPlaylists;
}
