import Sidebar from "@/components/Sidebar.js";
import { spacesController } from "@/controllers/spaces.controller.js";

export default function spacesView() {
  setTimeout(() => {
    spacesController();
  });

  return `
    <div class="flex min-h-screen bg-slate-100">
      ${Sidebar()}

      <main class="flex-1 p-6 overflow-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Espacios de trabajo</h1>
            <p class="text-slate-500 text-sm">Management of available spaces</p>
          </div>
          <button
            id="newSpaceBtn"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
            <i class="fa-solid fa-plus"></i> New space
          </button>
        </div>

        <div id="spacesContainer" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <p class="text-slate-400 text-sm">Loading spaces...</p>
        </div>
      </main>
    </div>
  `;
}