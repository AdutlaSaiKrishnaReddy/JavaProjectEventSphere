function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    // ❌ Do NOT alert here
    throw new Error("No token");
  }

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {

    // 🔴 ONLY logout on 401 (invalid/expired token)
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      alert("Session expired. Please login again.");
      window.location.href = "login.html";
      throw new Error("Unauthorized");
    }

  
    return res;
  });
}
