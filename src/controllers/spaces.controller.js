import { openModal, closeModal } from "@/components/Modal.js";
import {
  getSpaces,
  createSpace,
  updateSpace,
  deleteSpace,
} from "@/services/space.service.js";
import { showToast, spaceTypeLabel } from "@/utils/utils.js";

let allSpaces = [];

const spaceStatusClass = (status) =>
  status === "available"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-600";

const renderSpaces = () => {
  const container = document.querySelector("#spacesContainer");
  if (!container) return;

  container.innerHTML = allSpaces.length
    ? allSpaces
        .map(
          (s) => `
        <article class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-bold text-slate-800">${s.name}</h3>
            <span class="text-xs font-medium px-2 py-1 rounded-full ${spaceStatusClass(s.status)}">
              ${s.status === "available" ? "Available" : "Not available"}
            </span>
          </div>
          <div class="text-sm text-slate-600 space-y-1 mb-4">
            <p><i class="fa-solid fa-tag"></i> ${spaceTypeLabel(s.type)}</p>
            <p><i class="fa-solid fa-user"></i> Capacity: ${s.capacity} people</p>
            <p><i class="fa-solid fa-map-pin"></i> ${s.location}</p>
          </div>
          <div class="flex gap-2">
            <button data-action="edit" data-id="${s.id}"
              class="flex-1 text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition">
              Edit
            </button>
            <button data-action="delete" data-id="${s.id}"
              class="flex-1 text-xs bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition">
              Eliminate
            </button>
          </div>
        </article>
      `
        )
        .join("")
    : `<p class="text-slate-400 text-sm">There are no registered spaces.</p>`;

  container.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idRaw = btn.dataset.id;
      const id = /^\d+$/.test(idRaw) ? parseInt(idRaw, 10) : idRaw;
      const space = allSpaces.find((s) => String(s.id) === String(id));
      if (btn.dataset.action === "edit") openSpaceForm(space);
      else if (btn.dataset.action === "delete") doDelete(id);
    });
  });
};

const reload = async () => {
  allSpaces = await getSpaces();
  renderSpaces();
};

const doDelete = async (id) => {
  if (!confirm("Delete this space? Make sure it doesn't have any active bookings.")) return;
  try {
    await deleteSpace(id);
    showToast("Removed space", "info");
    await reload();
  } catch {
    showToast("Error deleting space", "error");
  }
};

const openSpaceForm = (space = null) => {
  const isEdit = !!space;

  openModal(`
    <div class="p-6">
      <h2 class="text-xl font-bold text-slate-800 mb-5">${isEdit ? "Edit space" : "New space"}</h2>

      <form id="spaceForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input type="text" name="name" required value="${isEdit ? space.name : ""}"
            placeholder="Meeting room A"
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
          <select name="type" required
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select a type</option>
            <option value="sala_reunion" ${isEdit && space.type === "sala_reunion" ? "selected" : ""}>Meeting Room</option>
            <option value="oficina_privada" ${isEdit && space.type === "oficina_privada" ? "selected" : ""}>Private Office</option>
            <option value="coworking" ${isEdit && space.type === "coworking" ? "selected" : ""}>Coworking</option>
            <option value="auditorio" ${isEdit && space.type === "auditorio" ? "selected" : ""}>Lounge</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Capacity (people)</label>
          <input type="number" name="capacity" required min="1" value="${isEdit ? space.capacity : ""}"
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Ubicación</label>
          <input type="text" name="location" required value="${isEdit ? space.location : ""}"
            placeholder="Floor 2"
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">State</label>
          <select name="status" required
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="available" ${!isEdit || space.status === "available" ? "selected" : ""}>Available</option>
            <option value="unavailable" ${isEdit && space.status === "unavailable" ? "selected" : ""}>Not available</option>
          </select>
        </div>

        <p id="spaceFormError" class="text-red-500 text-sm hidden"></p>

        <div class="flex gap-3 pt-2">
          <button type="submit"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
            ${isEdit ? "Save changes" : "Create space"}
          </button>
          <button type="button" id="cancelSpaceBtn"
            class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `);

  document.querySelector("#cancelSpaceBtn").addEventListener("click", closeModal);

  document.querySelector("#spaceForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const errorEl = document.querySelector("#spaceFormError");

    const name = form.name.value.trim();
    const type = form.type.value;
    const capacity = parseInt(form.capacity.value);
    const location = form.location.value.trim();
    const status = form.status.value;

    if (!name || !type || !capacity || !location) {
      errorEl.textContent = "Complete all fields.";
      errorEl.classList.remove("hidden");
      return;
    }

    try {
      if (isEdit) {
        await updateSpace(space.id, { name, type, capacity, location, status });
        showToast("Updated space", "success");
      } else {
        await createSpace({ name, type, capacity, location, status });
        showToast("Created space", "success");
      }
      closeModal();
      await reload();
    } catch {
      errorEl.textContent = "Error saving space.";
      errorEl.classList.remove("hidden");
    }
  });
};

export const spacesController = async () => {
  await reload();
  document.querySelector("#newSpaceBtn")?.addEventListener("click", () => openSpaceForm());
};