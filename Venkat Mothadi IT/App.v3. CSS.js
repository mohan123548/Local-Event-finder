const API_BASE_URL = "http://127.0.0.1:8001";

function getAccessToken() {
  return sessionStorage.getItem("lef_access_token") ||
    localStorage.getItem("lef_access_token");
}

function getLoggedInUser() {
  const raw = sessionStorage.getItem("lef_user") ||
    localStorage.getItem("lef_user");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const fallbackEvents = [
  {
    id: "demo-1",
    title: "Midnight Jazz in the Glasshouse",
    description: "A cinematic evening of live jazz, candlelight and intimate performances in a hidden glasshouse.",
    category: "Music",
    city: "Berlin",
    venue: "The Glasshouse",
    start_datetime: "2026-08-02T21:30:00",
    latitude: 52.5200,
    longitude: 13.4050,
    organizer: "Nocturne Collective",
    image_url: "assets/event-music.svg"
  },
  {
    id: "demo-2",
    title: "Future Web & AI Summit",
    description: "A practical technology summit covering FastAPI, modern JavaScript, AI tools and product design.",
    category: "Technology",
    city: "Berlin",
    venue: "Innovation Hub",
    start_datetime: "2026-08-05T09:30:00",
    latitude: 52.5310,
    longitude: 13.3849,
    organizer: "Local Developer Network",
    image_url: "assets/event-tech.svg"
  },
  {
    id: "demo-3",
    title: "Green City Community Lab",
    description: "Meet local residents and learn urban gardening, composting and neighborhood sustainability.",
    category: "Community",
    city: "Berlin",
    venue: "Riverside Garden",
    start_datetime: "2026-08-08T10:00:00",
    latitude: 52.5075,
    longitude: 13.3904,
    organizer: "Green City Circle",
    image_url: "assets/event-community.svg"
  },
  {
    id: "demo-4",
    title: "Independent Cinema After Dark",
    description: "An atmospheric outdoor screening featuring bold short films from emerging European creators.",
    category: "Art",
    city: "Potsdam",
    venue: "Lake View Lawn",
    start_datetime: "2026-08-10T20:30:00",
    latitude: 52.3906,
    longitude: 13.0645,
    organizer: "Indie Screen Society",
    image_url: "assets/event-art.svg"
  },
  {
    id: "demo-5",
    title: "Street Food Makers Market",
    description: "Taste chef-led street food, local desserts and seasonal specialties from independent kitchens.",
    category: "Food",
    city: "Berlin",
    venue: "Market Hall Nine",
    start_datetime: "2026-08-12T12:00:00",
    latitude: 52.5021,
    longitude: 13.4316,
    organizer: "Berlin Food Makers",
    image_url: "assets/event-food.svg"
  },
  {
    id: "demo-6",
    title: "Electronic Garden Sessions",
    description: "A sunset electronic music experience combining ambient sound, projection art and garden spaces.",
    category: "Music",
    city: "Berlin",
    venue: "Botanical Courtyard",
    start_datetime: "2026-08-14T18:30:00",
    latitude: 52.4563,
    longitude: 13.3050,
    organizer: "Sound Garden Berlin",
    image_url: "assets/event-music.svg"
  }
];

const imageByCategory = {
  music: "assets/event-music.svg",
  parties: "assets/event-music.svg",
  nightlife: "assets/event-music.svg",
  technology: "assets/event-tech.svg",
  tech: "assets/event-tech.svg",
  community: "assets/event-community.svg",
  art: "assets/event-art.svg",
  cinema: "assets/event-art.svg",
  food: "assets/event-food.svg"
};

const state = {
  events: [],
  filteredEvents: [],
  category: "",
  search: "",
  sort: "soonest",
  layout: "grid",
  savedIds: new Set(JSON.parse(localStorage.getItem("lef-pro-saved") || "[]")),
  featuredEventId: null,
  selectedEventId: null,
  map: null,
  mapLayer: null
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const elements = {
  search: $("#globalSearch"),
  apiStatus: $("#apiStatus"),
  apiPulse: $("#apiPulse"),
  eventGrid: $("#eventGrid"),
  eventCount: $("#eventCount"),
  sort: $("#sortSelect"),
  categoryRail: $("#categoryRail"),
  scheduleGrid: $("#scheduleGrid"),
  mapEventList: $("#mapEventList"),
  savedCountBadge: $("#savedCountBadge"),
  totalEventsStat: $("#totalEventsStat"),
  cityCountStat: $("#cityCountStat"),
  savedEventsStat: $("#savedEventsStat"),
  sidebar: $("#sidebar"),
  modalOverlay: $("#modalOverlay"),
  createModal: $("#createModal"),
  profileModal: $("#profileModal"),
  detailsModal: $("#detailsModal"),
  toast: $("#toast")
};

function valueOr(value, fallback = "") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function escapeHtml(value) {
  const node = document.createElement("div");
  node.textContent = valueOr(value);
  return node.innerHTML;
}

function normalizeEvent(event, index) {
  return {
    ...event,
    id: event.id ?? `event-${index}`,
    title: valueOr(event.title || event.name, "Untitled event"),
    description: valueOr(event.description, "A local experience worth discovering."),
    category: valueOr(event.category, "General"),
    city: valueOr(event.city, "Local area"),
    venue: valueOr(event.venue, "Venue to be announced"),
    organizer: valueOr(event.organizer, "Local organizer"),
    latitude: Number.isFinite(Number(event.latitude)) ? Number(event.latitude) : null,
    longitude: Number.isFinite(Number(event.longitude)) ? Number(event.longitude) : null
  };
}

function eventDate(event) {
  const raw = event.start_datetime || event.start_date || event.date;
  if (!raw) return null;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateParts(event) {
  const date = eventDate(event);

  if (!date) {
    return { day: "--", month: "TBA" };
  }

  return {
    day: new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("en", { month: "short" }).format(date).toUpperCase()
  };
}

function formatDateTime(event) {
  const date = eventDate(event);

  if (!date) {
    return "Date to be announced";
  }

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function eventImage(event) {
  if (event.image_url) {
    return event.image_url;
  }

  const key = valueOr(event.category).toLowerCase();

  for (const [category, image] of Object.entries(imageByCategory)) {
    if (key.includes(category)) {
      return image;
    }
  }

  return "assets/event-art.svg";
}

function initials(name) {
  return valueOr(name, "LE")
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || "")
    .join("");
}

function isSaved(event) {
  return state.savedIds.has(String(event.id));
}

function persistSaved() {
  localStorage.setItem("lef-pro-saved", JSON.stringify([...state.savedIds]));
}

function setApiStatus(online) {
  elements.apiStatus.textContent = online ? "Connected" : "Demo data";
  elements.apiPulse.classList.toggle("online", online);
  elements.apiPulse.classList.toggle("offline", !online);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2600);
}

async function loadEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events?limit=100`, {
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const items = Array.isArray(payload) ? payload : payload.items;

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("No events returned");
    }

    state.events = items.map(normalizeEvent);
    setApiStatus(true);
  } catch (error) {
    console.warn("FastAPI is unavailable, using bundled demo events.", error);
    state.events = fallbackEvents.map(normalizeEvent);
    setApiStatus(false);
  }

  state.featuredEventId = state.events[0]?.id ?? null;
  applyFilters();
  renderStats();
  updateFeatured(findEvent(state.featuredEventId));
}

function findEvent(id) {
  return state.events.find(event => String(event.id) === String(id));
}

function applyFilters() {
  const query = state.search.trim().toLowerCase();

  state.filteredEvents = state.events.filter(event => {
    const categoryMatch = !state.category ||
      event.category.toLowerCase().includes(state.category.toLowerCase());

    const searchMatch = !query || [
      event.title,
      event.description,
      event.category,
      event.city,
      event.venue,
      event.organizer
    ].some(value => valueOr(value).toLowerCase().includes(query));

    return categoryMatch && searchMatch;
  });

  state.filteredEvents.sort((a, b) => {
    if (state.sort === "title") {
      return a.title.localeCompare(b.title);
    }

    const aTime = eventDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bTime = eventDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;

    return state.sort === "latest" ? bTime - aTime : aTime - bTime;
  });

  renderEvents();
}

function renderStats() {
  const cities = new Set(
    state.events
      .map(event => event.city.trim().toLowerCase())
      .filter(Boolean)
  );

  elements.totalEventsStat.textContent = state.events.length;
  elements.cityCountStat.textContent = cities.size;
  elements.savedEventsStat.textContent = state.savedIds.size;
  elements.savedCountBadge.textContent = state.savedIds.size;
}

function eventCardTemplate(event) {
  const date = dateParts(event);
  const saved = isSaved(event);

  return `
    <article class="event-card" data-event-id="${escapeHtml(event.id)}">
      <div class="event-image-wrap">
        <img src="${escapeHtml(eventImage(event))}"
             alt="${escapeHtml(event.title)}"
             loading="lazy" />

        <div class="event-top-badges">
          <span class="event-category">${escapeHtml(event.category)}</span>

          <span class="event-date">
            <strong>${date.day}</strong>
            <small>${date.month}</small>
          </span>
        </div>

        <button class="event-save-button ${saved ? "saved" : ""}"
                data-save-id="${escapeHtml(event.id)}"
                type="button"
                aria-label="${saved ? "Remove from schedule" : "Save event"}">
          <i class="${saved ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
        </button>
      </div>

      <div class="event-body">
        <div class="event-title-row">
          <h3 title="${escapeHtml(event.title)}">${escapeHtml(event.title)}</h3>
          <span class="event-price">FREE</span>
        </div>

        <p class="event-description">${escapeHtml(event.description)}</p>

        <div class="event-meta">
          <span>
            <i class="fa-regular fa-clock"></i>
            ${escapeHtml(formatDateTime(event))}
          </span>

          <span>
            <i class="fa-solid fa-location-dot"></i>
            ${escapeHtml(event.venue)}, ${escapeHtml(event.city)}
          </span>
        </div>

        <div class="event-footer">
          <div class="organizer">
            <span class="organizer-avatar">${escapeHtml(initials(event.organizer))}</span>
            <span>
              <strong>${escapeHtml(event.organizer)}</strong>
              <small>Verified organizer</small>
            </span>
          </div>

          <button class="details-button"
                  data-details-id="${escapeHtml(event.id)}"
                  type="button">
            View details
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderEvents() {
  elements.eventGrid.classList.toggle("list-layout", state.layout === "list");
  elements.eventCount.textContent = `(${state.filteredEvents.length})`;

  if (!state.filteredEvents.length) {
    elements.eventGrid.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-calendar-xmark fa-2x"></i>
        <strong>No matching events</strong>
        <span>Try another city, category or keyword.</span>
      </div>
    `;
    return;
  }

  elements.eventGrid.innerHTML = state.filteredEvents
    .map(eventCardTemplate)
    .join("");
}

function renderSchedule() {
  const savedEvents = state.events.filter(isSaved);

  elements.scheduleGrid.innerHTML = savedEvents.length
    ? savedEvents.map(eventCardTemplate).join("")
    : `
      <div class="empty-state">
        <i class="fa-regular fa-bookmark fa-2x"></i>
        <strong>Your schedule is empty</strong>
        <span>Bookmark an event to keep it here.</span>
      </div>
    `;
}

function updateFeatured(event) {
  if (!event) return;

  state.featuredEventId = event.id;

  $("#featuredImage").src = eventImage(event);
  $("#featuredTitle").textContent = event.title;
  $("#featuredCategory").textContent = `${event.category.toUpperCase()} · ${event.city.toUpperCase()}`;
  $("#featuredDate").textContent = formatDateTime(event);
  $("#featuredPlace").textContent = event.venue;

  updateFeaturedSaveButton(event);
}

function updateFeaturedSaveButton(event) {
  const button = $("#featuredSaveBtn");
  const saved = isSaved(event);

  button.classList.toggle("saved", saved);
  button.innerHTML = `<i class="${saved ? "fa-solid" : "fa-regular"} fa-bookmark"></i>`;
}

function toggleSaved(id) {
  const event = findEvent(id);

  if (!event) return;

  const key = String(event.id);

  if (state.savedIds.has(key)) {
    state.savedIds.delete(key);
    showToast(`Removed “${event.title}” from your schedule.`);
  } else {
    state.savedIds.add(key);
    showToast(`Saved “${event.title}” to your schedule.`);
  }

  persistSaved();
  renderStats();
  renderEvents();
  renderSchedule();

  const featured = findEvent(state.featuredEventId);
  if (featured) updateFeaturedSaveButton(featured);

  if (state.selectedEventId) {
    updateDetailsSaveButton(findEvent(state.selectedEventId));
  }
}

function showView(name) {
  $$(".view").forEach(view => {
    view.classList.toggle("active", view.id === `${name}View`);
  });

  $$(".nav-item[data-view]").forEach(button => {
    button.classList.toggle("active", button.dataset.view === name);
  });

  elements.sidebar.classList.remove("open");

  if (name === "schedule") {
    renderSchedule();
  }

  if (name === "map") {
    setTimeout(renderMap, 50);
  }
}

function renderMap() {
  if (!window.L) {
    showToast("The map library could not load.");
    return;
  }

  if (!state.map) {
    state.map = L.map("map").setView([52.52, 13.405], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(state.map);

    state.mapLayer = L.layerGroup().addTo(state.map);
  }

  state.mapLayer.clearLayers();

  const eventsWithLocation = state.events.filter(event =>
    event.latitude !== null && event.longitude !== null
  );

  const points = [];

  eventsWithLocation.forEach(event => {
    const point = [event.latitude, event.longitude];
    points.push(point);

    L.marker(point)
      .bindPopup(`
        <strong>${escapeHtml(event.title)}</strong><br>
        ${escapeHtml(event.venue)}<br>
        ${escapeHtml(formatDateTime(event))}
      `)
      .addTo(state.mapLayer);
  });

  elements.mapEventList.innerHTML = eventsWithLocation.length
    ? eventsWithLocation.map(event => `
        <div class="map-event-item">
          <strong>${escapeHtml(event.title)}</strong>
          <span>${escapeHtml(event.venue)}, ${escapeHtml(event.city)}</span>
        </div>
      `).join("")
    : `
      <div class="empty-state">
        <strong>No map coordinates</strong>
        <span>Add latitude and longitude to your events.</span>
      </div>
    `;

  if (points.length) {
    state.map.fitBounds(points, { padding: [40, 40], maxZoom: 13 });
  }

  setTimeout(() => state.map.invalidateSize(), 120);
}

function openModal(modal) {
  if (!modal) return;

  elements.modalOverlay.hidden = false;
  elements.modalOverlay.style.setProperty("display", "block");

  modal.hidden = false;
  modal.style.setProperty(
    "display",
    modal.classList.contains("details-modal") ? "grid" : "block"
  );

  document.body.style.overflow = "hidden";
}

function closeModals() {
  elements.modalOverlay.hidden = true;
  elements.modalOverlay.style.setProperty("display", "none");

  $$(".modal").forEach(modal => {
    modal.hidden = true;
    modal.style.setProperty("display", "none");
  });

  state.selectedEventId = null;
  document.body.style.overflow = "";
}

function openDetails(event) {
  if (!event) return;

  state.selectedEventId = event.id;

  $("#detailsImage").src = eventImage(event);
  $("#detailsCategory").textContent = event.category.toUpperCase();
  $("#detailsTitle").textContent = event.title;
  $("#detailsDescription").textContent = event.description;
  $("#detailsDate").textContent = formatDateTime(event);
  $("#detailsPlace").textContent = `${event.venue}, ${event.city}`;
  $("#detailsOrganizer").textContent = event.organizer;

  updateDetailsSaveButton(event);
  openModal(elements.detailsModal);
}

function updateDetailsSaveButton(event) {
  if (!event) return;

  const button = $("#detailsSaveBtn");
  const saved = isSaved(event);

  button.textContent = saved ? "Remove from my schedule" : "Save to my schedule";
}

async function createEvent(formData) {
  const payload = {
    title: formData.get("title"),
    category: formData.get("category") || null,
    city: formData.get("city") || null,
    venue: formData.get("venue") || null,
    start_datetime: formData.get("start_datetime")
      ? new Date(formData.get("start_datetime")).toISOString()
      : null,
    organizer: formData.get("organizer") || null,
    description: formData.get("description") || null,
    end_datetime: null,
    latitude: null,
    longitude: null,
    image_url: null,
    source_url: null
  };

  const token = getAccessToken();

  if (!token) {
    throw new Error("Please sign in before publishing an event.");
  }

  const response = await fetch(`${API_BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

function answerAssistant(query) {
  const normalized = query.toLowerCase();

  let matches = state.events.filter(event => {
    const searchable = [
      event.title,
      event.description,
      event.category,
      event.city,
      event.venue
    ].join(" ").toLowerCase();

    const words = normalized
      .split(/\s+/)
      .filter(word => word.length > 3);

    return !words.length || words.some(word => searchable.includes(word));
  });

  if (!matches.length) {
    matches = [...state.events];
  }

  matches = matches
    .sort((a, b) => {
      const aTime = eventDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bTime = eventDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    })
    .slice(0, 3);

  return matches.length
    ? `My best matches are: ${matches.map(event => `${event.title} in ${event.city}`).join("; ")}.`
    : "I could not find a matching event yet.";
}

function addChatMessage(message, type) {
  const node = document.createElement("div");
  node.className = `chat-bubble ${type}`;
  node.textContent = message;

  $("#chatMessages").appendChild(node);
  node.scrollIntoView({ behavior: "smooth", block: "end" });
}

elements.search.addEventListener("input", event => {
  state.search = event.target.value;
  applyFilters();
});

elements.sort.addEventListener("change", event => {
  state.sort = event.target.value;
  applyFilters();
});

elements.categoryRail.addEventListener("click", event => {
  const button = event.target.closest(".vibe-card");

  if (!button) return;

  $$(".vibe-card").forEach(item => item.classList.remove("active"));
  button.classList.add("active");

  state.category = button.dataset.category;
  applyFilters();
});

document.addEventListener("click", event => {
  const navButton = event.target.closest("[data-view]");
  if (navButton) {
    showView(navButton.dataset.view);
  }

  const actionButton = event.target.closest("[data-action='open-create']");
  if (actionButton) {
    openModal(elements.createModal);
  }

  const saveButton = event.target.closest("[data-save-id]");
  if (saveButton) {
    toggleSaved(saveButton.dataset.saveId);
  }

  const detailsButton = event.target.closest("[data-details-id]");
  if (detailsButton) {
    openDetails(findEvent(detailsButton.dataset.detailsId));
  }

  if (event.target.closest("[data-close-modal]") ||
      event.target === elements.modalOverlay) {
    closeModals();
  }

  if (event.target.closest("[data-back]")) {
    showView("discover");
  }
});

$("#resetFiltersBtn").addEventListener("click", () => {
  state.search = "";
  state.category = "";
  elements.search.value = "";

  $$(".vibe-card").forEach(item => item.classList.remove("active"));
  $(".vibe-card[data-category='']").classList.add("active");

  applyFilters();
});

$("#listToggleBtn").addEventListener("click", () => {
  state.layout = state.layout === "grid" ? "list" : "grid";
  $("#listToggleBtn i").className = state.layout === "grid"
    ? "fa-solid fa-table-cells-large"
    : "fa-solid fa-list";
  renderEvents();
});

$("#featuredSaveBtn").addEventListener("click", () => {
  toggleSaved(state.featuredEventId);
});

$("#featuredDetailsBtn").addEventListener("click", () => {
  openDetails(findEvent(state.featuredEventId));
});

$("#detailsSaveBtn").addEventListener("click", () => {
  toggleSaved(state.selectedEventId);
});

$("#surpriseBtn").addEventListener("click", () => {
  if (!state.events.length) return;

  const randomEvent = state.events[Math.floor(Math.random() * state.events.length)];
  updateFeatured(randomEvent);
  showToast(`Today's surprise: ${randomEvent.title}`);
});

$("#themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");
  $("#themeBtn i").className = document.body.classList.contains("light")
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
});

$("#menuBtn").addEventListener("click", () => {
  elements.sidebar.classList.toggle("open");
});

$("#profileBtn").addEventListener("click", () => {
  openModal(elements.profileModal);
});

const demoSignInButton = $("#demoSignInBtn");

if (demoSignInButton) {
  demoSignInButton.addEventListener("click", () => {
    closeModals();
    showToast("Demo explorer profile enabled.");
  });
}

$("#nearbyBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    showToast("Location is not supported by this browser.");
    return;
  }

  showToast("Checking nearby events...");

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;

      const nearbyEvents = state.events
        .filter(event => event.latitude !== null && event.longitude !== null)
        .map(event => ({
          ...event,
          distance: haversineKm(latitude, longitude, event.latitude, event.longitude)
        }))
        .sort((a, b) => a.distance - b.distance);

      if (!nearbyEvents.length) {
        showToast("No events include coordinates yet.");
        return;
      }

      state.filteredEvents = nearbyEvents;
      elements.eventGrid.innerHTML = nearbyEvents.map(eventCardTemplate).join("");
      elements.eventCount.textContent = `(${nearbyEvents.length} nearby)`;

      showToast(
        `Nearest: ${nearbyEvents[0].title}, ${nearbyEvents[0].distance.toFixed(1)} km away.`
      );
    },
    () => {
      showToast("Location permission was not available.");
    }
  );
});

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRadians = value => value * Math.PI / 180;
  const radius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return 2 * radius * Math.asin(Math.sqrt(a));
}

$("#createEventForm").addEventListener("submit", async event => {
  event.preventDefault();

  const message = $("#createEventMessage");
  message.textContent = "Publishing event...";

  try {
    const created = normalizeEvent(
      await createEvent(new FormData(event.target)),
      state.events.length
    );

    state.events.push(created);
    event.target.reset();

    message.textContent = "Event published successfully.";
    applyFilters();
    renderStats();
    showToast("Your event is now live.");

    setTimeout(closeModals, 650);
  } catch (error) {
    console.error(error);
    message.textContent = "FastAPI is not reachable. Start the backend on port 8001.";
  }
});

$("#assistantForm").addEventListener("submit", event => {
  event.preventDefault();

  const input = $("#assistantInput");
  const query = input.value.trim();

  if (!query) return;

  addChatMessage(query, "user");
  input.value = "";

  setTimeout(() => {
    addChatMessage(answerAssistant(query), "assistant");
  }, 350);
});

$$("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => {
    const query = button.dataset.prompt;
    addChatMessage(query, "user");

    setTimeout(() => {
      addChatMessage(answerAssistant(query), "assistant");
    }, 350);
  });
});

document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    elements.search.focus();
  }

  if (event.key === "Escape") {
    closeModals();
    elements.sidebar.classList.remove("open");
  }
});

// Always start with every modal and overlay closed.
closeModals();
loadEvents();


function updateProfileFromSession() {
  const user = getLoggedInUser();

  if (!user) return;

  const avatar = document.querySelector(".profile-avatar");
  const copy = document.querySelector(".profile-copy");

  if (avatar) {
    avatar.textContent = user.full_name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0] || "")
      .join("")
      .toUpperCase();
  }

  if (copy) {
    copy.innerHTML = `
      <strong>${escapeHtml(user.full_name)}</strong>
      <small>${escapeHtml(user.role)}</small>
    `;
  }
}

updateProfileFromSession();
