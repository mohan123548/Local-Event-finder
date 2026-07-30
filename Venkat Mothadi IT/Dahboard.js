const API_BASE_URL = "http://127.0.0.1:8001";
const requiredRole = document.body.dataset.requiredRole;

function readStored(key) {
  return sessionStorage.getItem(key) || localStorage.getItem(key);
}

function clearSession() {
  ["lef_access_token", "lef_user"].forEach(key => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

function redirectToLogin() {
  window.location.replace(
    requiredRole === "admin" ? "admin-login.html" : "user-login.html"
  );
}

async function verifySession() {
  const token = readStored("lef_access_token");

  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) throw new Error("Session invalid");

    const user = await response.json();

    if (user.role !== requiredRole) {
      clearSession();
      redirectToLogin();
      return;
    }

    document.querySelectorAll("[data-user-name]").forEach(node => {
      node.textContent = user.full_name;
    });

    document.querySelectorAll("[data-user-email]").forEach(node => {
      node.textContent = user.email;
    });

    if (requiredRole === "admin") {
      loadLoginHistory(token);
    }
  } catch (error) {
    console.error(error);
    clearSession();
    redirectToLogin();
  }
}

document.querySelectorAll("[data-logout]").forEach(button => {
  button.addEventListener("click", () => {
    clearSession();
    redirectToLogin();
  });
});

verifySession();

function escapeCell(value) {
  const node = document.createElement("div");
  node.textContent = value ?? "";
  return node.innerHTML;
}

function formatAuditDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value || "-";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

async function loadLoginHistory(token = readStored("lef_access_token")) {
  const table = document.getElementById("auditTableBody");

  if (!table || !token) return;

  table.innerHTML = '<tr><td colspan="6">Loading login history...</td></tr>';

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/admin/login-history?limit=200`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Unable to load login history");
    }

    const records = await response.json();

    table.innerHTML = records.length
      ? records.map(record => `
          <tr>
            <td>${escapeCell(formatAuditDate(record.created_at))}</td>
            <td>${escapeCell(record.email_attempted)}</td>
            <td>${escapeCell(record.role_requested)}</td>
            <td>
              <span class="audit-status ${record.success ? "success" : "failed"}">
                ${record.success ? "Successful" : "Failed"}
              </span>
            </td>
            <td>${escapeCell(record.ip_address || "-")}</td>
            <td>${escapeCell(record.failure_reason || "-")}</td>
          </tr>
        `).join("")
      : '<tr><td colspan="6">No login attempts recorded yet.</td></tr>';
  } catch (error) {
    console.error(error);
    table.innerHTML =
      '<tr><td colspan="6">Could not load login history.</td></tr>';
  }
}

const refreshAuditButton = document.getElementById("refreshAuditBtn");

if (refreshAuditButton) {
  refreshAuditButton.addEventListener("click", () => {
    loadLoginHistory();
  });
}
