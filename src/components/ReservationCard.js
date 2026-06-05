import { statusLabel, statusClass, formatDate, isAdmin } from "@/utils/utils.js";

/**
 * Reusable component for creating cards
 * @param {string} reservation - The title of the book.
 * @param {Object} Any - The author of the book.
 */
export default function ReservationCard(reservation, { onEdit, onDelete, onApprove, onReject, onCancel } = {}) {
  const { id, spaceName, date, startHour, endHour, reason, status, userName } = reservation;
  const admin = isAdmin();
  const session = JSON.parse(localStorage.getItem("user"));
  const isOwner = reservation.userId === session?.id;
  const isPending = status === "pending";
  const isApproved = status === "approved";

  const canEdit = admin || (isOwner && isPending);
  const canDelete = admin;
  const canApprove = admin && isPending;
  const canReject = admin && isPending;
  const canCancel = isOwner && isApproved;

  return `
    <article data-id="${id}" class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-bold text-slate-800 text-base">${spaceName}</h3>
        <span class="text-xs font-medium px-2 py-1 rounded-full ${statusClass(status)}">${statusLabel(status)}</span>
      </div>

      ${admin ? `<p class="text-xs text-indigo-600 font-medium mb-2">Solicitante: ${userName}</p>` : ""}

      <div class="text-sm text-slate-600 space-y-1">
        <p><i class="fa-solid fa-calendar-days"></i> ${formatDate(date)}</p>
        <p><i class="fa-solid fa-clock"></i> ${startHour} - ${endHour}</p>
        <p class="truncate"><i class="fa-solid fa-file-pen"></i> ${reason}</p>
      </div>

      <div class="flex flex-wrap gap-2 mt-4">
        ${canApprove ? `<button data-action="approve" data-id="${id}" class="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition">Approve</button>` : ""}
        ${canReject ? `<button data-action="reject" data-id="${id}" class="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition">Decline</button>` : ""}
        ${canEdit ? `<button data-action="edit" data-id="${id}" class="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">Edit</button>` : ""}
        ${canCancel ? `<button data-action="cancel" data-id="${id}" class="text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition">Cancel</button>` : ""}
        ${canDelete ? `<button data-action="delete" data-id="${id}" class="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-300 transition">Eliminate</button>` : ""}
      </div>
    </article>
  `;
}