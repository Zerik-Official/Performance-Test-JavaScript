import Sidebar from "@/components/Sidebar.js";
import { isAdmin } from "@/utils/utils.js";
import { reservationsController } from "@/controllers/reservations.controller.js";

export default function reservationsView() {
  const admin = isAdmin();

  setTimeout(() => {
    reservationsController();
  });

  return `
    <div class="flex min-h-screen bg-slate-100">
      ${Sidebar()}

      <main class="flex-1 p-6 overflow-auto">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Reservas</h1>
            <p class="text-slate-500 text-sm">${admin ? "Global reservation management" : "My reservations"}</p>
          </div>
          <button
            id="newReservationBtn"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
            + Nueva reserva
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-4 mb-5 flex flex-col md:flex-row gap-3">
          <input
            id="searchInput"
            type="text"
            placeholder="Search by space, reason, or user..."
            class="border border-slate-200 rounded-lg px-4 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <select id="filterStatus" class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All states</option>
            <option value="pending">Earring</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Canceled</option>
          </select>
          <input
            id="filterDate"
            type="date"
            class="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <button id="clearFilters" class="text-sm text-slate-500 hover:text-indigo-600 transition px-2">
            Limpiar
          </button>
        </div>

        <div id="reservationsContainer" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <p class="text-slate-400 text-sm col-span-3">Loading reservations...</p>
        </div>

        <div id="paginationContainer" class="flex justify-center gap-2 mt-6"></div>
      </main>
    </div>
  `;
}