import { storageService } from "../async-storage.service.js";
import { utilService } from "../util.service.js";

export const userService = {
  getDefaultUser,
  getUserById,
  updateUser,
  removeUser,
  signup,
  login,
  logout,
  save, // temp for demo data
  addPlaylistToUserLibrary,
  removePlaylistFromUserLibrary,
};

const STORAGE_KEY = "usersDB"; // temp for demo data

function getDefaultUser() {
  return {
    _id: utilService.makeId(),
    username: "admin",
    fullName: "admin",
    email: "admin@admin.com",
    password: "admin",
    profileImg: "https://randomuser.me/api/portraits/thumb/men/1.jpg",
    isAdmin: true,
    library: { playlists: [] },
  };
}

function getUserById(userId) {
  return storageService.get(STORAGE_KEY, userId);
  /*
  const user = await httpService.get(`user/${userId}`)
	return user
  */
}
async function updateUser(userId, updatedFields) {
  const user = await getUserById(userId);
  const updatedUser = { ...user, ...updatedFields }; // TBD : validate updatedFields
  await save(updatedUser);
  /*
  const user = await httpService.get(`user/${userId}`)
	return user
  */
}

function removeUser(userId) {
  return;
  /*
	return httpService.delete(`user/${userId}`)
  */
}

async function signup(userCred) {
  return;
  /*
  const user = await httpService.post('auth/signup', userCred)
  return user
  */
}

async function login(userCred) {
  return;
  /*
  const user = await httpService.post('auth/login', userCred)
  // TODO: save non-critcal user data to storage for easy access
  return user
  */
}

async function logout() {
  return;
  /*
	return await httpService.post('auth/logout')
  */
}

async function save(user) {
  // temp for demo data
  let users = utilService.loadFromStorage(STORAGE_KEY) || [];
  const idx = users.findIndex((u) => u._id === user._id);
  if (idx !== -1) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  utilService.saveToStorage(STORAGE_KEY, users);
  return user;
}

async function addPlaylistToUserLibrary(userId, playlistId) {
  const user = await getUserById(userId);
  if (!user || !user.library) throw new Error("User or user library not found");

  user.library = {
    ...user.library,
    playlists: [...user.library.playlists, playlistId],
  };

  await save(user);
}

async function removePlaylistFromUserLibrary(userId, playlistId) {
  const user = await getUserById(userId);
  if (!user || !user.library) throw new Error("User or user library not found");

  user.library.playlists = user.library.playlists.filter(
    (id) => id !== playlistId
  );
  await save(user);
}
