function initServerSearch() {
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  const pageContent =
    document.getElementById("pageContent") ||
    document.getElementById("events-container");

  if (!input || !results) return;

  const token = localStorage.getItem("token");

  // 🔒 Disable search UI if not logged in
  if (!token) {
    input.disabled = true;
    input.placeholder = "Login to search events";

    input.onclick = () => {
      window.location.href = "login.html";
    };
    return;
  }

  let timer;

  input.addEventListener("input", () => {
    clearTimeout(timer);
    const q = input.value.trim();

    if (!q) {
      results.innerHTML = "";
      results.style.display = "none";
      if (pageContent) pageContent.style.display = "block";
      return;
    }

    timer = setTimeout(async () => {
      try {
        results.style.display = "grid";
        if (pageContent) pageContent.style.display = "none";

        const res = await authFetch(
          `/events/search?q=${encodeURIComponent(q)}`
        );

        const data = await res.json();
        results.innerHTML = "";

        if (!data.length) {
          results.innerHTML = "<p>No events found</p>";
          return;
        }

        data.forEach((e) => {
          results.innerHTML += `
            <div class="card">
              <img src="${e.image}" alt="${e.name}">
              <h5>${e.name}</h5>
              <p>${e.location} | ${e.date} | ${e.time}</p>
              <div class="card-footer">
                <button class="price-btn">₹ ${e.price}</button>
              </div>
            </div>
          `;
        });
      } catch (err) {
        console.error("Search failed", err);
      }
    }, 300);
  });
}
