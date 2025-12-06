export const userService = {
  getDefaultUser,
  getUserById,
  updateUser,
  removeUser,
  signup,
  login,
  logout
};

function getDefaultUser() {
  return {
    username: 'admin',
    fullname: 'admin',
    email: 'admin@admin.com',
    password: 'admin',
    profilePicture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
    isAdmin: true,
    library: [],
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
