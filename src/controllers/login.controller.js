// Utils functions
import { saveSession } from "@/utils/utils.js";
import { navigateTo } from "@/router/router.js";
import { http } from "@/api/http.js";

// Components
import formBadged from "@/components/formsBadgeds.js";

export const loginController = () => {
  const form = document.getElementById("loginForm");
  const errorContainer = document.getElementById("errorContainer");
  const btn = document.getElementById("loginBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      errorContainer.innerHTML = formBadged("Complete all fields", "error");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Verifying...";
    errorContainer.innerHTML = "";

    try {
      const users = await http.get(`/users?email=${email}&password=${password}`);

      if (!users.length) {

        errorContainer.innerHTML = formBadged("Incorrect email or password.", "error");

        btn.disabled = false;
        btn.textContent = "Login";
        return;
      }

      errorContainer.innerHTML = formBadged("Access granted! Redirecting...", "sucess");
      const user = users[0];
      saveSession({ id: user.id, name: user.name, role: user.role, email: user.email });

      setTimeout(()=> {
        navigateTo("/home");
      }, 3000)
      
    } catch (error) {
      console.error(error);
      errorContainer.innerHTML = formBadged("Error connecting to the server. Make sure json-server is active.", "error");
      btn.disabled = false;
      btn.textContent = "Login";
    }
  });
};