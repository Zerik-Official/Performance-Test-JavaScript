import { removeSession, getSession, isAdmin } from "@/utils/utils.js";
import { navigateTo } from "@/router/router.js";

/** Sidebar component, responsible for rendering the different sections depending on role */
export default function Sidebar() {
  const user = getSession();
  const admin = isAdmin();

  setTimeout(() => {
    document.querySelector("#logoutBtn")?.addEventListener("click", () => {
      removeSession();
      navigateTo("/");
    });

    document.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(link.getAttribute("href"));
      });
    });
  });

  const path = window.location.pathname;


  /**
   * Private function, responsible for creating the HTML for each sidebar section.
   * @param {string} href - Section Path
   * @param {string} label - Message to display in the section
   * @param {string} icon - Icon to display in the section
   */
  const navItem = (href, label, icon) => {
    const active = path === href ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white";
    return `
      <a href="${href}" data-link
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${active}">
        <span class="text-base"><i class="${icon}"></i></span>
        ${label}
      </a>
    `;
  };

  return `
    <aside class="w-64 bg-slate-900 text-white h-screen flex flex-col p-5 shrink-0">
      <div class="mb-8">
        <h2 class="text-xl font-bold text-white">SpaceBook</h2>
        <p class="text-xs text-slate-400 mt-1">Gestión de espacios</p>
      </div>

      <div class="mb-6 px-3 py-3 bg-slate-800 rounded-lg">
        <p class="text-sm font-semibold text-white truncate">${user?.name}</p>
        <span class="text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${admin ? "bg-indigo-600 text-white" : "bg-slate-600 text-slate-200"}">
          ${admin ? "Administrator" : "User"}
        </span>
      </div>

      <nav class="flex flex-col gap-1 flex-1">
        ${navItem("/home", "Home", "fa-solid fa-house")}
        ${navItem("/reservations", "Reservations", "fa-solid fa-calendar")}
        ${admin ? navItem("/spaces", "Spaces", "fa-solid fa-building") : ""}
        ${admin ? navItem("/users", "Users", "fa-solid fa-user-group") : ""}
        ${admin ? navItem("/dashboard", "Dashboard", "fa-solid fa-chart-column") : ""}
      </nav>

      <button
        id="logoutBtn"
        class="mt-4 flex items-center gap-2 text-left w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900 hover:text-white transition cursor-pointer">
        <i class="fa-solid fa-arrow-right-from-bracket"></i> Sign out
      </button>
    </aside>
  `;
}