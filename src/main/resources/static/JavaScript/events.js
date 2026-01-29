const API_URL = "/events";

let allEvents = [];

/* ================= INIT PAGE ================= */
async function initPage() {
    try {
        const navbarRes = await fetch("/navbar.html");
        const navbarHTML = await navbarRes.text();
        document.getElementById("nav-placeholder").innerHTML = navbarHTML;

        initNavbar();
        initNavbarAuth();
        initServerSearch();

        await getEvents();
    } catch (err) {
        console.error("Init error:", err);
    }
}

initPage();

/* ================= FETCH EVENTS ================= */
async function getEvents() {
    try {
        const res = await authFetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch events");

        allEvents = await res.json();
        displayEvents(allEvents);
    } catch (err) {
        console.error(err.message);
    }
}

/* ================= DISPLAY EVENTS ================= */
function displayEvents(events) {
    const container = document.getElementById("events-container");
    if (!container) return;

    container.innerHTML = "";
    container.style.display = "grid";

    events.forEach(event => {
        container.appendChild(createCard(event));
    });
}

/* ================= CREATE CARD ================= */
function createCard(event) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
    <img src="${event.image}" alt="${event.name}" />
    <h5>${event.name}</h5>
    <p>${event.location} | ${event.date} | ${event.time}</p>
    <div class="card-footer">
      <button class="price-btn">₹ ${event.price}</button>
      <button class="add-cartbtn" data-id="${event.id}">
        <ion-icon name="cart-outline"></ion-icon>
        Register
      </button>
    </div>
  `;

    return card;
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

