const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const tokenKey = "todo-app-token";

export function apiFetch(path, options = {}, token) {
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  });
}
