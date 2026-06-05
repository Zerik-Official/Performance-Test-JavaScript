import { getReservations } from "@/services/reservation.service.js";
import { getSpaces } from "@/services/space.service.js";
import { getUsers } from "@/services/user.service.js";
import { spaceTypeLabel } from "@/utils/utils.js";

export const dashboardController = async () => {
  const container = document.querySelector("#dashboardContent");
  try {
    const [reservations, spaces, users] = await Promise.all([
      getReservations(),
      getSpaces(),
      getUsers(),
    ]);

    const total = reservations.length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const approved = reservations.filter((r) => r.status === "approved").length;
    const rejected = reservations.filter((r) => r.status === "rejected").length;
    const cancelled = reservations.filter((r) => r.status === "cancelled").length;
    const availableSpaces = spaces.filter((s) => s.status === "available").length;

    const spaceUsage = spaces.map((s) => ({
      name: s.name,
      count: reservations.filter((r) => r.spaceId === s.id).length,
    })).sort((a, b) => b.count - a.count);

    const maxCount = spaceUsage[0]?.count || 1;

    const statusData = [
      { label: "Earrings", count: pending, color: "bg-yellow-400" },
      { label: "Approved", count: approved, color: "bg-green-500" },
      { label: "Rejected", count: rejected, color: "bg-red-500" },
      { label: "Canceled", count: cancelled, color: "bg-slate-400" },
    ];

    container.innerHTML = `
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <p class="text-3xl font-bold text-indigo-600">${total}</p>
          <p class="text-xs text-slate-500 mt-1">Total reserves</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <p class="text-3xl font-bold text-blue-600">${spaces.length}</p>
          <p class="text-xs text-slate-500 mt-1">Spaces</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <p class="text-3xl font-bold text-green-600">${availableSpaces}</p>
          <p class="text-xs text-slate-500 mt-1">Available spaces</p>
        </div>
        <div class="bg-white rounded-xl p-4 shadow-sm text-center">
          <p class="text-3xl font-bold text-slate-700">${users.length}</p>
          <p class="text-xs text-slate-500 mt-1">Users</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-5">
          <h3 class="font-bold text-slate-800 mb-4">Reservations by state</h3>
          <div class="space-y-3">
            ${statusData.map((s) => `
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-slate-600">${s.label}</span>
                  <span class="font-medium text-slate-800">${s.count}</span>
                </div>
                <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="${s.color} h-full rounded-full transition-all" style="width: ${total ? Math.round((s.count / total) * 100) : 0}%"></div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-5">
          <h3 class="font-bold text-slate-800 mb-4">More reserved spaces</h3>
          <div class="space-y-3">
            ${spaceUsage.map((s) => `
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-slate-600">${s.name}</span>
                  <span class="font-medium text-slate-800">${s.count}</span>
                </div>
                <div class="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="bg-indigo-500 h-full rounded-full" style="width: ${maxCount ? Math.round((s.count / maxCount) * 100) : 0}%"></div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-5 mt-6">
        <h3 class="font-bold text-slate-800 mb-4">Últimas 5 reservas</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="text-left px-4 py-2 text-slate-500 font-medium">Usuario</th>
                <th class="text-left px-4 py-2 text-slate-500 font-medium">Espacio</th>
                <th class="text-left px-4 py-2 text-slate-500 font-medium">Fecha</th>
                <th class="text-left px-4 py-2 text-slate-500 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${reservations.slice(-5).reverse().map((r) => `
                <tr class="border-t border-slate-100">
                  <td class="px-4 py-2 text-slate-700">${r.userName}</td>
                  <td class="px-4 py-2 text-slate-700">${r.spaceName}</td>
                  <td class="px-4 py-2 text-slate-500">${r.date}</td>
                  <td class="px-4 py-2">
                    <span class="text-xs px-2 py-1 rounded-full ${
                      r.status === "approved" ? "bg-green-100 text-green-700" :
                      r.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      r.status === "rejected" ? "bg-red-100 text-red-600" :
                      "bg-slate-100 text-slate-500"
                    }">${r.status}</span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-red-500 text-sm">Error loading dashboard.</p>`;
  }
};