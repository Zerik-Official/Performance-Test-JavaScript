import ReservationCard from "@/components/ReservationCard.js";
import { openModal, closeModal } from "@/components/Modal.js";
import {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from "@/services/reservation.service.js";
import { getSpaces } from "@/services/space.service.js";
import { getSession, isAdmin, showToast } from "@/utils/utils.js";

const PAGE_SIZE = 6;
let allReservations = [];
let filtered = [];
let currentPage = 1;

const getFiltered = () => {
  const search = document.querySelector("#searchInput")?.value.toLowerCase() || "";
  const status = document.querySelector("#filterStatus")?.value || "";
  const date = document.querySelector("#filterDate")?.value || "";

  return allReservations.filter((r) => {
    const matchSearch =
      !search ||
      r.spaceName?.toLowerCase().includes(search) ||
      r.reason?.toLowerCase().includes(search) ||
      r.userName?.toLowerCase().includes(search);
    const matchStatus = !status || r.status === status;
    const matchDate = !date || r.date === date;
    return matchSearch && matchStatus && matchDate;
  });
};

const renderPagination = (total) => {
  const container = document.querySelector("#paginationContainer");
  if (!container) return;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) { container.innerHTML = ""; return; }

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<button data-page="${i}" class="px-3 py-1.5 rounded-lg text-sm font-medium transition ${i === currentPage ? "bg-indigo-600 text-white" : "bg-white border text-slate-600 hover:bg-slate-50"}">${i}</button>`;
  }
  container.innerHTML = html;

  container.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.dataset.page);
      renderCards();
    });
  });
};

const renderCards = () => {
  filtered = getFiltered();
  const start = (currentPage - 1) * PAGE_SIZE;
  const page = filtered.slice(start, start + PAGE_SIZE);
  const container = document.querySelector("#reservationsContainer");
  if (!container) return;

  container.innerHTML = page.length
    ? page.map((r) => ReservationCard(r)).join("")
    : `<p class="text-slate-400 text-sm col-span-3 text-center py-10">No reservations to show.</p>`;

  renderPagination(filtered.length);
  bindCardActions();
};

const bindCardActions = () => {
  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idRaw = btn.dataset.id;
      const id = /^\d+$/.test(idRaw) ? parseInt(idRaw, 10) : idRaw;
      const action = btn.dataset.action;
      const reservation = allReservations.find((r) => String(r.id) === String(id));

      if (action === "approve") await doStatusChange(id, "approved", "Approved reservation");
      else if (action === "reject") await doStatusChange(id, "rejected", "Reservation rejected");
      else if (action === "cancel") await doStatusChange(id, "cancelled", "Reservation canceled");
      else if (action === "delete") await doDelete(id);
      else if (action === "edit") openReservationForm(reservation);
    });
  });
};

const doStatusChange = async (id, status, msg) => {
  try {
    await updateReservation(id, { status });
    showToast(msg, "success");
    await reload();
  } catch {
    showToast("Error updating reservation", "error");
  }
};

const doDelete = async (id) => {
  if (!confirm("Delete this reservation?")) return;
  try {
    await deleteReservation(id);
    showToast("Reservation removed", "info");
    await reload();
  } catch {
    showToast("Error deleting reservation", "error");
  }
};

const reload = async () => {
  const user = getSession();
  const admin = isAdmin();
  const all = await getReservations();
  allReservations = admin ? all : all.filter((r) => r.userId === user.id);
  currentPage = 1;
  renderCards();
};

const openReservationForm = async (reservation = null) => {
  const spaces = await getSpaces();
  const isEdit = !!reservation;
  const availableSpaces = spaces.filter((s) => s.status === "available" || (isEdit && String(s.id) === String(reservation.spaceId)));

  const spaceOptions = availableSpaces
    .map((s) => {
      const notAvailable = s.status !== "available";
      const label = `${s.name}${notAvailable ? " (not available)" : ""} (${s.type.replace("_", " ")})`;
      const selected = isEdit && String(reservation.spaceId) === String(s.id) ? "selected" : "";
      return `<option value="${s.id}" data-name="${s.name}" ${selected}>${label}</option>`;
    })
    .join("");

  openModal(`
    <div class="p-6">
      <h2 class="text-xl font-bold text-slate-800 mb-5">${isEdit ? "Edit reservation" : "New reservation"}</h2>

      <form id="reservationForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Space</label>
          <select id="spaceSelect" name="spaceId" required
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select a space</option>
            ${spaceOptions}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
          <input type="date" name="date" required value="${isEdit ? reservation.date : ""}"
            min="${new Date().toISOString().split("T")[0]}"
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Hora inicio</label>
            <input type="time" name="startHour" required value="${isEdit ? reservation.startHour : ""}"
              class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Hora fin</label>
            <input type="time" name="endHour" required value="${isEdit ? reservation.endHour : ""}"
              class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Motivo</label>
          <textarea name="reason" required rows="2"
            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Describe the reason for the reservation">${isEdit ? reservation.reason : ""}</textarea>
        </div>

        <p id="formError" class="text-red-500 text-sm hidden"></p>

        <div class="flex gap-3 pt-2">
          <button type="submit"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
            ${isEdit ? "Save changes" : "Create reservation"}
          </button>
          <button type="button" id="cancelFormBtn"
            class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg text-sm font-medium transition">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `);

  document.querySelector("#cancelFormBtn").addEventListener("click", closeModal);

  document.querySelector("#reservationForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const formError = document.querySelector("#formError");
    const spaceSelect = document.querySelector("#spaceSelect");
    const selectedOption = spaceSelect.options[spaceSelect.selectedIndex];

    const spaceIdRaw = form.spaceId.value;
    let spaceId = null;
    if (spaceIdRaw !== "") {
      spaceId = /^\d+$/.test(spaceIdRaw) ? parseInt(spaceIdRaw, 10) : spaceIdRaw;
    }

    let spaceName = selectedOption?.dataset.name || "";
    if (!spaceName && spaceId != null) {
      const s = spaces.find((sp) => String(sp.id) === String(spaceId));
      if (s) spaceName = s.name;
    }

    let date = form.date.value;
    if (date && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [d, m, y] = date.split("/");
      date = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    const startHour = form.startHour.value;
    const endHour = form.endHour.value;
    const reason = form.reason.value.trim();

    if (spaceId == null || !date || !startHour || !endHour || !reason) {
      formError.textContent = "Complete all fields.";
      formError.classList.remove("hidden");
      return;
    }

    if (startHour >= endHour) {
      formError.textContent = "The start time must be earlier than the end time.";
      formError.classList.remove("hidden");
      return;
    }

    const all = await getReservations();
    const conflict = all.find((r) => {
      if (isEdit && r.id === reservation.id) return false;
      if (String(r.spaceId) !== String(spaceId) || r.date !== date) return false;
      if (r.status === "cancelled" || r.status === "rejected") return false;
      return startHour < r.endHour && endHour > r.startHour;
    });

    if (conflict) {
      formError.textContent = "There is already a reservation for that space and time.";
      formError.classList.remove("hidden");
      return;
    }

    const user = getSession();

    try {
      if (isEdit) {
        await updateReservation(reservation.id, { spaceId, spaceName, date, startHour, endHour, reason });
        showToast("Updated reservation", "success");
      } else {
        await createReservation({
          userId: user.id,
          userName: user.name,
          spaceId,
          spaceName,
          date,
          startHour,
          endHour,
          reason,
          status: "pending",
        });
        showToast("Reservation created successfully", "success");
      }
      closeModal();
      await reload();
    } catch {
      formError.textContent = "Error saving the reservation.";
      formError.classList.remove("hidden");
    }
  });
};

export const reservationsController = async () => {
  await reload();

  document.querySelector("#newReservationBtn")?.addEventListener("click", () => openReservationForm());

  ["searchInput", "filterStatus", "filterDate"].forEach((id) => {
    document.querySelector(`#${id}`)?.addEventListener("input", () => {
      currentPage = 1;
      renderCards();
    });
  });

  document.querySelector("#clearFilters")?.addEventListener("click", () => {
    const s = document.querySelector("#searchInput");
    const fs = document.querySelector("#filterStatus");
    const fd = document.querySelector("#filterDate");
    if (s) s.value = "";
    if (fs) fs.value = "";
    if (fd) fd.value = "";
    currentPage = 1;
    renderCards();
  });
};