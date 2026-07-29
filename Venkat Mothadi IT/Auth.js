const API_HOST = ["127.0.0.1", "localhost"].includes(window.location.hostname)
  ? window.location.hostname
  : "127.0.0.1";

const API_BASE_URL = `http://${API_HOST}:8001`;

const pageType = document.body.dataset.authPage;
const formMessage = document.getElementById("formMessage");

function showMessage(message, type = "") {
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`.trim();
}

function setButtonLoading(button, loading, normalLabel) {
  if (!button) return;

  button.disabled = loading;

  button.innerHTML = loading
    ? '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Please wait...</span>'
    : `<span>${normalLabel}</span><i class="fa-solid fa-arrow-right"></i>`;
}

function saveSession(payload, remember) {
  const storage = remember ? localStorage : sessionStorage;

  localStorage.removeItem("lef_access_token");
  localStorage.removeItem("lef_user");
  sessionStorage.removeItem("lef_access_token");
  sessionStorage.removeItem("lef_user");

  storage.setItem("lef_access_token", payload.access_token);
  storage.setItem("lef_user", JSON.stringify(payload.user));
}

async function postJson(endpoint, payload) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Backend connection failed:", error);

    throw new Error(
      "Cannot connect to FastAPI. Keep the backend running on " +
      `${API_BASE_URL} and check ${API_BASE_URL}/health.`
    );
  }

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const detail = typeof data.detail === "string"
      ? data.detail
      : `Request failed with status ${response.status}.`;

    throw new Error(detail);
  }

  return data;
}

document.querySelectorAll("[data-password-toggle]").forEach(button => {
  button.addEventListener("click", () => {
    const input = button.parentElement.querySelector("input");
    const showing = input.type === "text";

    input.type = showing ? "password" : "text";
    button.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    button.innerHTML = `<i class="fa-regular ${showing ? "fa-eye" : "fa-eye-slash"}"></i>`;
  });
});

document.querySelectorAll("[data-forgot-password]").forEach(button => {
  button.addEventListener("click", () => {
    showMessage(
      "Password reset is not connected yet. Add an email reset endpoint after login is working.",
      ""
    );
  });
});

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!loginForm.reportValidity()) return;

    const button = document.getElementById("loginButton");
    const normalLabel = pageType === "admin"
      ? "Enter admin portal"
      : "Sign in securely";

    setButtonLoading(button, true, normalLabel);
    showMessage("Checking your credentials...");

    const formData = new FormData(loginForm);
    const endpoint = pageType === "admin"
      ? "/api/auth/admin-login"
      : "/api/auth/user-login";

    try {
      const result = await postJson(endpoint, {
        email: formData.get("email").trim(),
        password: formData.get("password")
      });

      saveSession(result, formData.get("remember") === "on");

      showMessage("Login successful. Redirecting...", "success");

      window.setTimeout(() => {
        window.location.href = pageType === "admin"
          ? "admin-dashboard.html"
          : "user-home.html";
      }, 650);
    } catch (error) {
      console.error(error);
      showMessage(error.message, "error");
      setButtonLoading(button, false, normalLabel);
    }
  });
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!registerForm.reportValidity()) return;

    const button = document.getElementById("registerButton");
    setButtonLoading(button, true, "Create account");
    showMessage("Creating your account...");

    const formData = new FormData(registerForm);

    try {
      await postJson("/api/auth/register", {
        full_name: formData.get("full_name").trim(),
        email: formData.get("email").trim(),
        password: formData.get("password")
      });

      showMessage("Account created. Opening the login page...", "success");

      window.setTimeout(() => {
        window.location.href = "user-login.html";
      }, 750);
    } catch (error) {
      console.error(error);
      showMessage(error.message, "error");
      setButtonLoading(button, false, "Create account");
    }
  });
}