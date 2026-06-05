/**
 * Component for displaying errors in forms.
 * @param {string} message - Message to display on the badged.
 * @param {string} type - Type of badge to display, error or success.
 */
export default function formBadged(message, type) {
    return type === "error" ? 
    `
        <div id="loginError" class="flex items-center gap-2 bg-red-500/10 border border-red-500/50 text-red-400 text-sm py-3 px-4 rounded-xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>${message}</span>
        </div>
    `
    :
    `
        <div id="loginError" class="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm py-3 px-4 rounded-xl mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>${message}</span>
        </div>
    `
}0