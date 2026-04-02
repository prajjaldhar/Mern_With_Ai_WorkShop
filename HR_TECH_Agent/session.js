// session.js
const sessionStore = {};

export function setSession(userId, data) {
  sessionStore[userId] = data;
}

export function getSession(userId) {
  return sessionStore[userId];
}

export function clearSession(userId) {
  delete sessionStore[userId];
}
