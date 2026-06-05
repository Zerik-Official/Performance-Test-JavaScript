import ReservationCard from "@/components/ReservationCard.js";
import { getReservations } from "@/services/reservation.service.js";
import { getSession, isAdmin } from "@/utils/utils.js";
import { navigateTo } from "@/router/router.js";

/** The homeView controller orchestrates calls to the ReservationCard, getReservations functions and all interactivity logic */
export const homeController = async () => {
  const user = getSession();
  const admin = isAdmin();

  try {
    const all = await getReservations();
    const reservations = admin ? all : all.filter((r) => r.userId === user.id);
    const recent = reservations.slice(-4).reverse();

    const statTotal = document.querySelector("#statTotal");
    const statPending = document.querySelector("#statPending");
    const statApproved = document.querySelector("#statApproved");
    const statRejected = document.querySelector("#statRejected");
    const container = document.querySelector("#recentReservations");

    if (statTotal) statTotal.textContent = reservations.length;
    if (statPending) statPending.textContent = reservations.filter((r) => r.status === "pending").length;
    if (statApproved) statApproved.textContent = reservations.filter((r) => r.status === "approved").length;
    if (statRejected) statRejected.textContent = reservations.filter((r) => r.status === "rejected").length;

    if (container) {
      container.innerHTML = recent.length
        ? recent.map((r) => ReservationCard(r)).join("")
        : `<p class="text-slate-400 text-sm col-span-2">Sin reservas recientes.</p>`;
    }

    document.querySelectorAll("[data-link]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(link.getAttribute("href"));
      });
    });
  } catch (err) {
    console.error("Error cargando datos del home:", err);
  }
};