import { loginController } from "@/controllers/login.controller.js";

export default function loginView() {
  setTimeout(() => {
    loginController();
  });

  return `
    <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-indigo-950 px-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-slate-800">SpaceBook</h1>
          <p class="text-slate-500 text-sm mt-1">Gestión de espacios de trabajo</p>
        </div>

        <form id="loginForm" novalidate>

          <p id="loginError" class="text-red-500 text-sm mb-4 hidden"></p>

          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="correo@empresa.com"
              class="border border-slate-300 w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              class="border border-slate-300 w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
          </div>

          <button
            type="submit"
            id="loginBtn"
            class="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2.5 rounded-lg font-medium transition text-sm">
            Iniciar sesión
          </button>
        </form>

      </div>
    </div>
  `;
}