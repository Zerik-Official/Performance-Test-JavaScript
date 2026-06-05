import Sidebar from "@/components/Sidebar.js";
import { dashboardController } from "@/controllers/dashboard.controller.js";

export default function dashboardView() {
  setTimeout(() => {
    dashboardController();
  });

  return `
    <div class="flex min-h-screen bg-slate-100">
      ${Sidebar()}

      <main class="flex-1 p-6 overflow-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p class="text-slate-500 text-sm">General usage statistics</p>
        </div>

        <div id="dashboardContent">
          <p class="text-slate-400 text-sm">Loading statistics...</p>
        </div>
      </main>
    </div>
  `;
}