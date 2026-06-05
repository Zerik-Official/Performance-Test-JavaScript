export const saveSession = (user) => {
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
};

export const getSession = () => {
  return JSON.parse(
    localStorage.getItem("user")
  );
};

export const removeSession = () => {
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!getSession();
};

export const isAdmin = () => {
  return getSession()?.role === "admin";
};

/**
 * Helper function to hash a password.
 * @param {string} password - Password to hash.
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}