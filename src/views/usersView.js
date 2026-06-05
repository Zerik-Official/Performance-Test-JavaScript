import Sidebar from "@/components/Sidebar.js";
import { usersController } from "@/controllers/users.controller.js";

export default function usersView() {
  setTimeout(() => {
    usersController();
  });

  return `
    <div class="flex min-h-screen bg-slate-100">
      ${Sidebar()}

      <main class="flex-1 p-6 overflow-auto">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-slate-800">Registered users</h1>
          <p class="text-slate-500 text-sm">List of system users</p>
        </div>

        <div id="usersContainer" class="bg-white rounded-xl shadow-sm overflow-hidden">
          <p class="text-slate-400 text-sm p-6">Loading users...</p>
        </div>
      </main>
    </div>
  `;
}