const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.style.display = "none";

  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  const loginType = document
    .getElementById("loginType")
    .value.toUpperCase();

  if (!email || !password) {
    showError("All fields are required");
    return;
  }

  // 🔐 Clear old session before login
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.message || "Invalid email or password");
      return;
    }

    // ✅ Role validation
    if (data.role.toUpperCase() !== loginType) {
      showError("Invalid account type");
      return;
    }

    // ✅ Save JWT
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    // ✅ Redirect
    window.location.href =
      data.role === "ADMIN" ? "admin.html" : "index.html";

  } catch (err) {
    console.error(err);
    showError("Server error. Try again later.");
  }
});

function showError(msg) {
  loginError.innerText = msg;
  loginError.style.display = "block";
}
