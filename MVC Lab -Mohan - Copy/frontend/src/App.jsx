import { useEffect, useState } from "react";
import { login, logout, isLoggedIn, fetchUsers, fetchTasksAccordingUser, createTask, deleteTask } from "./services/api";
import styles from "./App.module.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [ownerId, setOwnerId] = useState("");

  async function refresh() {
    try {
      const data = await fetchTasksAccordingUser();
      setTasks(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }

  async function refreshUsers() {
    try {
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (!loggedIn) return;
    refresh().finally(() => setLoading(false));
    refreshUsers();
  }, [loggedIn]);

  useEffect(() => {
    if (!ownerId) return;

    async function loadUserTasks() {
      setLoading(true);
      try {
        const data = await fetchTasksAccordingUser(ownerId);
        setTasks(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadUserTasks();
  }, [ownerId]);

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  async function handleAdd(e) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setBusy(true);
    try {
      await createTask(t, ownerId);
      setTitle("");
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    setBusy(true);
    try {
      await deleteTask(id);
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.h1}>Tasks</h1>
      <form onSubmit={handleAdd} className={styles.form}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title…"
          className={styles.input}
          disabled={busy}
        />
        <select
          className={styles.btn}
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          disabled={busy}
        >
          <option value="">Select owner…</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className={styles.btn}
          disabled={busy || !title.trim()}
        >
          Add
        </button>
      </form>
      {error && <div className={styles.error}>Error: {error}</div>}
      {loading ? (
        <div className={styles.muted}>Loading…</div>
      ) : tasks.length === 0 ? (
        <div className={styles.muted}>No tasks yet — add one above.</div>
      ) : (
        <ul className={styles.list}>
          {tasks.map((t) => (
            <li key={t.id} className={styles.item}>
              <span>
                <span className={styles.id}>#{t.id}</span> {t.title}
              </span>
              <button
                onClick={() => handleDelete(t.id)}
                className={styles.del}
                disabled={busy}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [name, setName]         = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(null);
 
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(name, password);
      onLogin();
    } catch (e) { setError(e.message); }
  }
 
  return (
    <div style={{ maxWidth: 360, margin: "5rem auto", fontFamily: "system-ui" }}>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input value={name} onChange={e => setName(e.target.value)}
               placeholder="username" autoFocus />
        <input value={password} onChange={e => setPassword(e.target.value)}
               type="password" placeholder="password" />
        <button type="submit">Log in</button>
      </form>
      {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
    </div>
  );
}