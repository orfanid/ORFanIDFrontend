const SESSION_KEY = "orfanid_admin_session";
const SESSION_HOURS = 8;

function expectedPassword() {
  return (
    process.env.VUE_APP_ADMIN_PASSWORD ||
    process.env.VUE_APP_DELETE_PASSCODE ||
    "admin123"
  );
}

export function isAdminAuthenticated() {
  const rawSession = window.localStorage.getItem(SESSION_KEY);
  if (!rawSession) {
    return false;
  }

  try {
    const session = JSON.parse(rawSession);
    const ageMs = Date.now() - Number(session.createdAt || 0);
    return ageMs >= 0 && ageMs < SESSION_HOURS * 60 * 60 * 1000;
  } catch (error) {
    window.localStorage.removeItem(SESSION_KEY);
    return false;
  }
}

export function loginAdmin(password) {
  if (password !== expectedPassword()) {
    return false;
  }

  window.localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      createdAt: Date.now()
    })
  );
  return true;
}

export function logoutAdmin() {
  window.localStorage.removeItem(SESSION_KEY);
}
