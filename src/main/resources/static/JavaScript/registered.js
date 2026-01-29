const REGISTERED_API = "/registeredEvents";

/* ================= LOAD NAVBAR ================= */
fetch("/navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("nav-placeholder").innerHTML = data;
    initNavbar();
    initNavbarAuth();
  });

/* ================= FETCH REGISTERED EVENTS ================= */
async function getRegisteredEvents() {
  try {
    const res = await authFetch(REGISTERED_API);
    const events = await res.json();
    displayRegisteredEvents(events);
  } catch (err) {
    console.error(err);
    alert("Failed to load registered events");
  }
}

function displayRegisteredEvents(events) {
  const tbody = document.querySelector("#events-table tbody");
  tbody.innerHTML = "";

  if (!events.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          No registered events
        </td>
      </tr>
    `;
    return;
  }

  events.forEach(event => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${event.name}</td>
      <td>${event.location}</td>
      <td>${event.date}</td>
      <td>${event.time}</td>
      <td>₹ ${event.price}</td>
    `;
    tbody.appendChild(row);
  });
}

getRegisteredEvents();
