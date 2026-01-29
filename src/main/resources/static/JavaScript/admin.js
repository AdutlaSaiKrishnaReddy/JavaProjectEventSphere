/* ===============================
   ADMIN ACCESS GUARD
=============================== */
if (!requireAdmin()) {
  throw new Error("Unauthorized");
}

/* ===============================
   CONFIG
=============================== */
const BASE_URL = "http://localhost:8080";
const EVENTS_API = `${BASE_URL}/events`;

/* ===============================
   DOM ELEMENTS
=============================== */
const form = document.getElementById("eventForm");
const tableBody = document.querySelector("#events-table tbody");

const modeSelect = document.getElementById("mode");
const locationWrapper = document.getElementById("locationWrapper");
const locationInput = document.getElementById("eventLocation");

let currentEditId = null;

/* ===============================
   DATE VALIDATION
=============================== */
const eventDateInput = document.getElementById("eventDate");

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
eventDateInput.setAttribute("min", `${yyyy}-${mm}-${dd}`);

/* ===============================
   MODE TOGGLE
=============================== */
modeSelect.addEventListener("change", () => {
  if (modeSelect.value === "ONLINE") {
    locationWrapper.style.display = "none";
    locationInput.value = "Online";
    locationInput.removeAttribute("required");
  } else {
    locationWrapper.style.display = "block";
    locationInput.value = "";
    locationInput.setAttribute("required", "true");
  }
});

/* ===============================
   SUBMIT (CREATE / UPDATE)
=============================== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const totalSlots = Number(document.getElementById("totalSlots").value);
  if (totalSlots <= 0) {
    alert("Total slots must be greater than 0");
    return;
  }

  const selectedDate = new Date(eventDateInput.value);
  selectedDate.setHours(0, 0, 0, 0);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  if (selectedDate < todayDate) {
    alert("Please select an upcoming date");
    return;
  }

  const event = {
    name: document.getElementById("eventName").value,
    mode: modeSelect.value,
    location:
      modeSelect.value === "ONLINE" ? "Online" : locationInput.value,
    date: document.getElementById("eventDate").value,
    time: document.getElementById("eventTime").value,
    price: document.getElementById("price").value,
    category: document.getElementById("category").value,
    image: document.getElementById("image").value,
    displayPage: document.getElementById("displayPage").value,
    displaySection: document.getElementById("displaySection").value,
    totalSlots,
    availableSlots: totalSlots,
  };

  try {
    const url = currentEditId
      ? `${EVENTS_API}/${currentEditId}`
      : EVENTS_API;

    const method = currentEditId ? "PUT" : "POST";

    const res = await authFetch(url, {
      method,
      body: JSON.stringify(event),
    });

    if (!res.ok) throw new Error("Save failed");

    alert(currentEditId ? "Event updated" : "Event created");

    currentEditId = null;
    form.reset();
    locationWrapper.style.display = "block";
    loadEvents();
  } catch (err) {
    console.error(err);
    alert("Error saving event");
  }
});

/* ===============================
   LOAD EVENTS
=============================== */
async function loadEvents() {
  try {
    const res = await authFetch(EVENTS_API);
    if (!res.ok) throw new Error("Fetch failed");

    const events = await res.json();
    tableBody.innerHTML = "";

    events.forEach((e) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${e.name}</td>
        <td>${e.mode}</td>
        <td>${e.location}</td>
        <td>${new Date(e.date).toLocaleDateString()}</td>
        <td>${e.time}</td>
        <td>${e.availableSlots}/${e.totalSlots}</td>
        <td>${e.displayPage}</td>
        <td>${e.displaySection}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      row.querySelector(".edit-btn").onclick = () => editEvent(e);
      row.querySelector(".delete-btn").onclick = () => deleteEvent(e.id);

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

loadEvents();

/* ===============================
   EDIT EVENT
=============================== */
function editEvent(event) {
  currentEditId = event.id;

  document.getElementById("eventName").value = event.name;
  document.getElementById("mode").value = event.mode;
  document.getElementById("eventDate").value = event.date;
  document.getElementById("eventTime").value = event.time;
  document.getElementById("price").value = event.price;
  document.getElementById("category").value = event.category;
  document.getElementById("image").value = event.image;
  document.getElementById("displayPage").value = event.displayPage;
  document.getElementById("displaySection").value = event.displaySection;
  document.getElementById("totalSlots").value = event.totalSlots;

  if (event.mode === "ONLINE") {
    locationWrapper.style.display = "none";
    locationInput.value = "Online";
  } else {
    locationWrapper.style.display = "block";
    locationInput.value = event.location;
  }
}

/* ===============================
   DELETE EVENT
=============================== */
async function deleteEvent(id) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  try {
    const res = await authFetch(`${EVENTS_API}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    alert("Event deleted");
    loadEvents();
  } catch (err) {
    console.error(err);
    alert("Error deleting event");
  }
}
