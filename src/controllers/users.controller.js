import { getUsers } from "@/services/user.service.js";

export const usersController = async () => {
  const container = document.querySelector("#usersContainer");
  try {
    const users = await getUsers();

    container.innerHTML = `
      <table class="w-full text-sm">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="text-left px-5 py-3 font-semibold text-slate-600">ID</th>
            <th class="text-left px-5 py-3 font-semibold text-slate-600">Nombre</th>
            <th class="text-left px-5 py-3 font-semibold text-slate-600">Correo</th>
            <th class="text-left px-5 py-3 font-semibold text-slate-600">Rol</th>
          </tr>
        </thead>
        <tbody>
          ${users
            .map(
              (u) => `
            <tr class="border-b border-slate-100 hover:bg-slate-50">
              <td class="px-5 py-3 text-slate-500">#${u.id}</td>
              <td class="px-5 py-3 font-medium text-slate-800">${u.name}</td>
              <td class="px-5 py-3 text-slate-600">${u.email}</td>
              <td class="px-5 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${
                  u.role === "admin"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-100 text-slate-600"
                }">
                  ${u.role === "admin" ? "Administrator" : "User"}
                </span>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-red-500 text-sm p-6">Error loading users.</p>`;
  }
};