const users = {};

function signup(username, password) {
  users[username] = password;
  return { username };
}

function login(username, password) {
  if (users[username] == password) {
    return Buffer.from(username).toString('base64');
  }
  return null;
}

function verify(token) {
  if (!token) return null;
  return Buffer.from(token, 'base64').toString();
}

module.exports = { signup, login, verify };
