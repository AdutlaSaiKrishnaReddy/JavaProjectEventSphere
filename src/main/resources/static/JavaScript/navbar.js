function initNavbar() {
  const openBtn = document.getElementById("open-sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const navbar = document.getElementById("navbar");
  const overlay = document.getElementById("overlay");

  if (!openBtn || !closeBtn || !navbar || !overlay) return;

  openBtn.onclick = () => {
    navbar.classList.add("show");
    overlay.style.display = "block";
  };

  function closeMenu() {
    navbar.classList.remove("show");
    overlay.style.display = "none";
  }

  closeBtn.onclick = closeMenu;
  overlay.onclick = closeMenu;
}


function initNavbarAuth() {
  const loginItem = document.getElementById("loginItem");
  const logoutItem = document.getElementById("logoutItem");
  const myEventsItem = document.getElementById("myEventsItem");
  const logoutBtn = document.getElementById("logoutBtn");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    if (loginItem) loginItem.style.display = "none";
    if (logoutItem) logoutItem.style.display = "block";
    if (myEventsItem) myEventsItem.style.display = "block";

    if (logoutBtn) {
      logoutBtn.onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "login.html";
      };
    }
  } else {
    if (loginItem) loginItem.style.display = "block";
    if (logoutItem) logoutItem.style.display = "none";
    if (myEventsItem) myEventsItem.style.display = "none";
  }
}




