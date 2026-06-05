export function openModal(contentHTML) {
  const existing = document.querySelector("#modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "modal-overlay";
  overlay.className = "fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4";
  overlay.innerHTML = `
    <div id="modal-box" class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      ${contentHTML}
    </div>
  `;

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.body.appendChild(overlay);
}

export function closeModal() {
  document.querySelector("#modal-overlay")?.remove();
}