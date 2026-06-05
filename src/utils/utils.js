let toastTimeout = null;

/**
 * Function to save user data.
 * @param {Object} user - User data, obtained from the API.
 */
export const saveSession = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

/** User data, obtained from localstorage */
export const getSession = () => {
  return JSON.parse(localStorage.getItem("user"));
};

/** Remove user data from localstorage */
export const removeSession = () => {
  localStorage.removeItem("user");
};

/** Checks if the user is logged in, returns a boolean accordingly. */
export const isAuthenticated = () => {
  return !!getSession();
};

/** Returns the user role, obtained from the user data in localstorage */
export const isAdmin = () => {
  return getSession()?.role === "admin";
};

/**
 * Auxiliary function for formatting dates.
 * @param {string} dateStr - Original date, unformatted.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
};

/**
 * Function to return capitalized strings, depending on the task state.
 * @param {string} status - Task status-
 */
export const statusLabel = (status) => {
  const map = {
    pending: "Earring",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Canceled",
  };
  return map[status] || status;
};

/**
 * Function to decide the color according to the status.
 * @param {string} status - Task status.
 */
export const statusClass = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-500",
  };
  return map[status] || "bg-gray-100 text-gray-600";
};

/**
 * This is a description of the foo function.
 * @param {string} type - Type of space to be mapped
 */
export const spaceTypeLabel = (type) => {
  const map = {
    sala_reunion: "Meeting Room",
    oficina_privada: "Private Office",
    coworking: "Coworking",
    auditorio: "Lounge",
  };
  return map[type] || type;
};

/**
 * Reusable function for displaying notifications
 * @param {string} message - Message to show.
 * @param {string} type - Type of notification to display: sucess, error, info, warning.
 */
export const showToast = (message, type = "success") => {
  const existing = document.querySelector("#toast");
  if (existing) existing.remove();
  if (toastTimeout) clearTimeout(toastTimeout);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500",
  };

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg text-white text-sm font-medium shadow-lg transition-all duration-300 ${colors[type] || colors.success}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  toastTimeout = setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
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