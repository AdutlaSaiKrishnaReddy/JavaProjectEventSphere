function requireLogin(message = "Please login") {
  const token = localStorage.getItem("token");
  if (!token) {
    alert(message);
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function requireAdmin() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "ADMIN") {
    alert("Admin access only");
    window.location.href = "index.html";
    return false;
  }
  return true;
}
