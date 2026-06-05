import Sidebar from "@/components/Sidebar.js";
import { getSession, isAdmin, formatDate, statusLabel, statusClass } from "@/utils/utils.js";
import { homeController } from "@/controllers/home.controller.js";

export default function homeView() {
  const user = getSession();
  const admin = isAdmin();

  setTimeout(() => {
    homeController();
  });

  return `
    <div class="flex min-h-screen bg-slate-100">
      ${Sidebar()}

      <main class="flex-1 p-6 overflow-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Welcome, ${user?.name}</h1>
          <p class="text-slate-500 text-sm mt-1">${admin ? "Administration panel" : "User panel"}</p>
        </div>

        <div id="statsRow" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl p-4 shadow-sm text-center">
            <p class="text-3xl font-bold text-indigo-600" id="statTotal">—</p>
            <p class="text-xs text-slate-500 mt-1">${admin ? "Total reserves" : "My reservations"}</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm text-center">
            <p class="text-3xl font-bold text-yellow-500" id="statPending">—</p>
            <p class="text-xs text-slate-500 mt-1">Earrings</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm text-center">
            <p class="text-3xl font-bold text-green-600" id="statApproved">—</p>
            <p class="text-xs text-slate-500 mt-1">Approved</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm text-center">
            <p class="text-3xl font-bold text-red-500" id="statRejected">—</p>
            <p class="text-xs text-slate-500 mt-1">Rejected</p>
          </div>
        </div>

        <section class="bg-white rounded-xl shadow-sm p-5">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-slate-800 text-lg">Recent reservations</h2>
            <a href="/reservations" data-link class="text-sm text-indigo-600 hover:underline">Ver todas →</a>
          </div>
          <div id="recentReservations" class="grid gap-3 md:grid-cols-2">
            <p class="text-slate-400 text-sm col-span-2">Charging...</p>
          </div>
        </section>
      </main>
    </div>
  `;
}