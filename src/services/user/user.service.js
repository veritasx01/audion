import { utilService } from "../../services/util.service.js";

export const userService = {
  getDefaultUser,
  getUserById,
  updateUser,
  removeUser,
  signup,
  login,
  logout,
  save, // temp for demo data
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
  return;
  /*
  const user = await httpService.get(`user/${userId}`)
	return user
  */
}
function updateUser(userId, updatedFields) {
  return;
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
