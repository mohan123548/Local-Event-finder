const BASE = "http://localhost:8000";
 
export async function fetchTasks() {
  const res = await fetch(`${BASE}/tasks/`);
 
  if (!res.ok) {
    throw new Error("Failed to load tasks");
  }
 
  return res.json();
}
 
export async function fetchUsers() {
  const res = await fetch(`${BASE}/users/`);
 
  if (!res.ok) {
    throw new Error("Failed to load users");
  }
 
  return res.json();
}
 
export async function createTask(title, ownerId) {
  const res = await fetch(`${BASE}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      owner_id: Number(ownerId),
    }),
  });
 
  if (!res.ok) {
    throw new Error("Failed to create task");
  }
 
  return res.json();
}
 
export async function deleteTask(taskId) {
  const res = await fetch(`${BASE}/tasks/${taskId}`, {
    method: "DELETE",
  });
 
  if (!res.ok) {
    throw new Error("Failed to delete task");
  }
}
 
export async function createUser(name) {
  const res = await fetch(`${BASE}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
 
  if (!res.ok) {
    throw new Error("Failed to create user");
  }
 
  return res.json();
}