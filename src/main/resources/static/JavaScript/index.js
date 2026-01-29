const EVENTS_API = "/events";
const REGISTERED_API = "/registeredEvents";

/* ================= LOAD NAVBAR ================= */
fetch("/navbar.html")
    .then((res) => res.text())
    .then((data) => {
        document.getElementById("nav-placeholder").innerHTML = data;

        initNavbar();
        initNavbarAuth();
        initServerSearch();

        handleSearchAccess(); // ✅ after navbar exists
    });

/* ================= SEARCH ACCESS CONTROL ================= */
function handleSearchAccess() {
    const token = localStorage.getItem("token");
    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    if (!token) {
        searchInput.disabled = true;
        searchInput.placeholder = "Login to search events";

        searchInput.addEventListener("click", () => {
            alert("Please login to search events");
            window.location.href = "login.html";
        });
    }
}

/* ================= LOAD HOME EVENTS ================= */
async function loadHomeEvents() {
    try {
        const res = await authFetch(EVENTS_API);
        const events = await res.json();

        const homeEvents = events.filter(e => e.displayPage === "HOME");

        renderEvents(
            "special-events",
            homeEvents.filter(e => e.displaySection === "SPECIAL")
        );

        renderEvents(
            "education-events",
            homeEvents.filter(e => e.category === "education")
        );

        renderEvents(
            "sports-events",
            homeEvents.filter(e => e.category === "sports")
        );

        renderEvents(
            "finance-events",
            homeEvents.filter(e => e.category === "finance")
        );

        renderEvents(
            "technology-events",
            homeEvents.filter(e => e.category === "technology")
        );

        renderEvents(
            "music-events",
            homeEvents.filter(e => e.category === "music")
        );

    } catch (err) {
        console.error("Failed to load home events", err);
    }
}

/* ================= RENDER EVENTS ================= */
function renderEvents(containerId, events) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const section = container.closest(".specilaloffers, .menu");

    if (!events || events.length === 0) {
        container.innerHTML = "";
        if (section) section.style.display = "none";
        return;
    }

    if (section) section.style.display = "block";

    container.innerHTML = "";

    events.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";

        card.innerHTML = `
      <img src="${event.image}" alt="${event.name}" />
      <h5>${event.name}</h5>
      <p>${event.location} | ${event.date} | ${event.time}</p>
      <div class="card-footer">
        <button class="price-btn">₹ ${event.price}</button>
        <button class="add-cartbtn"
          data-id="${event.id}"
          data-name="${event.name}"
          data-location="${event.location}"
          data-date="${event.date}"
          data-time="${event.time}"
          data-price="${event.price}">
          Register
        </button>
      </div>
    `;

        container.appendChild(card);
    });
}

/* ================= REGISTER EVENT ================= */
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".add-cartbtn");
  if (!btn) return;

  try {
    const res = await authFetch("/registeredEvents", {
      method: "POST",
      body: JSON.stringify({
        eventId: btn.dataset.id
      }),
    });

    // ❌ ERROR CASE
    if (!res.ok) {
      let errorMessage = "Registration failed";

      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // empty body (403 etc)
      }

      alert(errorMessage);
      return; // ✅ THIS IS THE KEY LINE
    }

    // ✅ SUCCESS CASE
    alert("Event registered successfully!");

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
});


/* ================= INIT ================= */
loadHomeEvents();

/* ================= SCROLL TRIGGER ANIMATIONS ================= */

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target); // animate once
            }
        });
    },
    {
        threshold: 0.15, // 15% visible
    }
);

document.querySelectorAll(".animate-on-scroll").forEach(el => {
    observer.observe(el);
});

