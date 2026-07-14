/**
 * GatherGo - Local & International Events Finder Core Engine
 * Handcrafted dynamic logic incorporating Leaflet maps, transit estimator,
 * dual-mode AI travel concierge, Stripe payment emulator, and LocalStorage sync.
 */

// ==========================================
// 1. DATA STATE & CONFIG
// ==========================================

const DEFAULT_COORDS = { lat: 35.6580, lng: 139.7016 }; // Default Tokyo Shibuya if no location
let userLocation = null;
let currentView = 'discover';
let activeEvent = null;
let leafletMap = null;
let mapMarkers = [];

// Curated initial Mock Events (Tokyo, London, Paris, San Francisco)
const INITIAL_EVENTS = [
  {
    id: "evt-tokyo-neon",
    title: "Tokyo Electronic Neon DJ Night",
    description: "Rhythm and neon come alive in the heart of Shibuya. Join world-renowned electronic DJs spinning deep house, cyberpunk beats, and future bass. Enjoy immersive 360-degree laser mappings, glowing cocktail lounges, and a high-energy dance floor that stays open until sunrise. Neon glowsticks and dynamic face paints are provided free at the entrance. Experience the pinnacle of Tokyo's futuristic nightlife!",
    category: "parties",
    date: "2026-05-30T22:00",
    price: 25,
    venue: "WOMB Tokyo, Shibuya",
    city: "Tokyo",
    lat: 35.6585,
    lng: 139.6961,
    organizer: "Tokyo Beats Co.",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
    reviews: [
      { user: "Hiroshi S.", rating: 5, comment: "Absolutely insane visuals! The laser mapping was state-of-the-art.", date: "2026-05-20" },
      { user: "Sarah L.", rating: 5, comment: "Unbelievable energy, the bass was vibrating the whole building! Highly recommend.", date: "2026-05-22" }
    ]
  },
  {
    id: "evt-paris-cinema",
    title: "Montmartre Indie Film & Wine Tasting",
    description: "A gorgeous, cozy evening under the stars in Paris's historical arts district. Gather at a hidden rooftop loft in Montmartre to watch 4 award-winning indie short films from French and international directors. Following the screenings, join a certified local sommelier for an intimate tasting session featuring 5 handpicked organic and natural wines, paired with artisanal French cheeses, fresh baguettes, and grapes. Perfect for cinema enthusiasts and romantic daters alike.",
    category: "art",
    date: "2026-06-02T19:30",
    price: 15,
    venue: "Terrass Rooftop, Paris",
    city: "Paris",
    lat: 48.8867,
    lng: 2.3431,
    organizer: "Les Cinéphiles de Paris",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
    reviews: [
      { user: "Pierre D.", rating: 4, comment: "Beautiful selection of films, and the Bordeaux wine was exquisite.", date: "2026-05-18" }
    ]
  },
  {
    id: "evt-london-tech",
    title: "London Tech Leaders Summit 2026",
    description: "The premier gathering for developers, product owners, venture capitalists, and technology researchers in the UK's bustling tech capital. Hosted at a beautiful glass-walled tech hub in Shoreditch, this day-long event features deep-dive keynotes on Decentralized Web Architectures, Ethical Generative AI systems, and scaling Node.js backends. Connect with over 500 professionals during our structured speed-networking lunches and rooftop sunset cocktails.",
    category: "tech",
    date: "2026-06-05T09:00",
    price: 120,
    venue: "The Stage Shoreditch, London",
    city: "London",
    lat: 51.5244,
    lng: -0.0767,
    organizer: "Silicon Roundabout Network",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    reviews: [
      { user: "Emma W.", rating: 5, comment: "Excellent keynote speakers. The panels on web performance and caching were extremely educational.", date: "2026-05-24" }
    ]
  },
  {
    id: "evt-sf-garden",
    title: "Mission District Urban Garden Co-Op",
    description: "Get your hands dirty and make friends at the Mission District's premier community green space. Together we will build modern cedar wood vertical planting systems, sew heirloom summer tomato seeds, and weed the community strawberry patch. After the physical work, gather in the garden pavilion for a relaxed organic lunch featuring freshly brewed local kombucha, field salads, and slow-baked wood-fired pizzas. 100% of proceeds and donations support local youth urban farming programs.",
    category: "community",
    date: "2026-05-31T10:00",
    price: 0,
    venue: "La Finca Co-op Garden, San Francisco",
    city: "San Francisco",
    lat: 37.7599,
    lng: -122.4148,
    organizer: "Mission Green Team",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&auto=format&fit=crop&q=80",
    reviews: [
      { user: "Alex T.", rating: 4, comment: "Super friendly crowd, amazing fresh kombucha! Very rewarding experience.", date: "2026-05-15" }
    ]
  },
  {
    id: "evt-tokyo-food",
    title: "Shibuya Hidden Izakaya Culinary Crawl",
    description: "Avoid tourist traps and dine like a true Tokyo native! Guided by a local culinary enthusiast, navigate the narrow, atmospheric alleyways of Shibuya to discover three hidden, century-old Izakayas (Japanese pubs). Sample authentic street skewers (Yakitori), deep-fried skewers (Kushikatsu), pan-fried gyoza, and freshly shaved Takoyaki. Learn about the rich history of sake brewing and beer cultures in Tokyo. Groups are limited to 8 guests to ensure an intimate and friendly atmosphere.",
    category: "community",
    date: "2026-06-03T18:00",
    price: 45,
    venue: "Nonbei Yokocho (Drunkard's Alley), Shibuya",
    city: "Tokyo",
    lat: 35.6595,
    lng: 139.7020,
    organizer: "Eat Tokyo Native",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    reviews: [
      { user: "Marcus G.", rating: 5, comment: "Hands down the best food tour I've taken. The third alleyway pub felt like stepping back in time.", date: "2026-05-19" }
    ]
  },
  {
    id: "evt-london-jazz",
    title: "Soho Candlelit Secret Jazz & Blues",
    description: "Step through a mysterious plain blue door tucked behind a dusty antiquarian bookstore in Soho and descend into a cozy, subterranean brick vault. Lit entirely by hundreds of real wax candles, this exclusive lounge plays host to London's finest jazz musicians. Sip curated classic prohibition-era cocktails while a soulful live double-bass quartet and guest female blues vocalists fill the acoustic brick chambers with warm, nostalgic melodies.",
    category: "art",
    date: "2026-05-30T21:30",
    price: 20,
    venue: "The Blue Arch Vault, London Soho",
    city: "London",
    lat: 51.5133,
    lng: -0.1332,
    organizer: "Soho Secret Society",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=80",
    reviews: [
      { user: "Claire M.", rating: 5, comment: "It felt so exclusive! The saxophone solo literally brought tears to my eyes.", date: "2026-05-23" }
    ]
  },
  {
    id: "evt-sf-hack",
    title: "Silicon Valley Web3 & AI Hackathon",
    description: "48 hours of pure creation, coding sprints, and structural designing in Palo Alto. Bring your teammates or join a group during our dynamic Friday icebreakers. Focus tracks include Decentralized Web Tech, AI Agent Swarms, and Sustainable Smart Contracts. Enjoy round-the-clock catering, energetic energy drink bars, ergonomic sleeping lounges, and elite technical mentors from standard firms. Win from a pool of $15,000 in hardware and developer prizes!",
    category: "tech",
    date: "2026-06-12T08:00",
    price: 0,
    venue: "Stanford Tech Commons, Palo Alto",
    city: "San Francisco",
    lat: 37.4419,
    lng: -122.1430,
    organizer: "SV Builder Guild",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
    reviews: []
  },
  {
    id: "evt-paris-techno",
    title: "Le Marais Secret Underground Techno",
    description: "A rare underground rave inside a vaulted, historical 15th-century stone cellar beneath Le Marais. Featuring a premium, imported L-Acoustics sound system, immersive red laser tunnels, and dark industrial visual mappings. Top Parisian underground techno DJs will spin modular synth techno, progressive acid beats, and driving hypnotic rhythms. Strict 'no camera' policy to foster absolute freedom, artistic self-expression, and respect on the dance floor.",
    category: "parties",
    date: "2026-06-19T23:00",
    price: 30,
    venue: "Les Caves du Marais, Paris",
    city: "Paris",
    lat: 48.8584,
    lng: 2.3596,
    organizer: "Marais Techno Underground",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
    reviews: [
      { user: "Jacques B.", rating: 5, comment: "The acoustic reverb in the stone vault was magical. Unbelievable night.", date: "2026-05-24" }
    ]
  }
];

// Preset banner images for organizer creation page
const PRESET_BANNERS = [
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80", // Party
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80", // Tech
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80", // Art
  "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=80"  // Community
];

// AI Chatbot Tour Guide Profiles
const AI_GUIDES = {
  "all-cities": {
    name: "GatherGo Global Planner AI",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    greeting: "Hello! I am your GatherGo Global Event Planner. I can suggest budget accommodations, unique local eateries, and transit cost-saving hacks for events in Tokyo, London, Paris, and San Francisco. Which event are you planning to attend?"
  },
  "tokyo": {
    name: "Hiro - Tokyo Nightlife Guru",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    greeting: "Konnichiwa! I'm Hiro, your Tokyo advisor. Ready to explore Shibuya's neon clubs, taste the best local yakitori stalls, or find capsule hotels near WOMB club? Tell me your budget and let's plan an epic night!"
  },
  "london": {
    name: "Eleanor - London Culture Guide",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    greeting: "Cheers! Eleanor here, ready to guide you through London's artistic Soho tunnels, find cheap hostels in Shoreditch, or recommend historical 17th-century pubs near Hyde Park. Let's make your London trip absolutely grand!"
  },
  "paris": {
    name: "Amélie - Paris Romantic advisor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    greeting: "Bonjour! I am Amélie. Let's arrange a dream Paris itinerary around Le Marais or Montmartre. From boutique bakeries to cheap, chic natural wine cellars and scenic hostels, I have you covered. Ask me anything!"
  },
  "sf": {
    name: "Jax - SF Tech & Adventure Scout",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    greeting: "Hey! I'm Jax, scouting Silicon Valley's tech spaces, organic vegan hotspots in the Mission, and affordable co-ops. Looking for cheap transit routes or Stanford tech hackathon tips? Hit me up!"
  }
};

// Travel AI local knowledge database
const TRAVEL_KNOWLEDGE = {
  tokyo: {
    hotels: [
      { name: "Shibuya Capsule Hotel Capsule-Land", cost: "~$35/night", tip: "Super compact, extremely clean, right in Shibuya center." },
      { name: "The Millennial Shibuya Smart Hostel", cost: "~$68/night", tip: "Modern capsule beds with folding couches and free afternoon beer!" },
      { name: "Book and Bed Tokyo Shinjuku", cost: "~$48/night", tip: "Sleep inside library bookshelves! Cozy and perfect for solo bookworms." }
    ],
    food: [
      { dish: "Ichiran Ramen Shibuya", cost: "$9/bowl", tip: "Solo eating booths with highly customized, rich Tonkotsu broth." },
      { dish: "Shibuya Nonbei Yokocho (Yakitori)", cost: "$2/skewer", tip: "Narrow, highly nostalgic alleyways. Eat freshly grilled charcoal skewers." },
      { dish: "Harajuku Marion Crepes", cost: "$5", tip: "Crispy sweet crepes filled with fresh strawberries, cream, and matcha brownies." }
    ],
    transport: "Take the JR Yamanote circle line or Tokyo Metro Ginza line. Buy a Suica/Pasmo card for easy tapping. Avoid taxis as they are extremely expensive!"
  },
  london: {
    hotels: [
      { name: "The Dictionary Hostel Shoreditch", cost: "~$28/night", tip: "Converted Victorian warehouse, highly artistic vibes and cheap bar downstairs." },
      { name: "Soho Generator Hostel London", cost: "~$34/night", tip: "Super famous social hostel with live DJs and massive pool tables." },
      { name: "YHA London Central", cost: "~$40/night", tip: "Very clean, safe, and just a 5-minute walk from Oxford Street." }
    ],
    food: [
      { dish: "Brick Lane Beigel Bake", cost: "$6/beigel", tip: "Open 24/7. Get the legendary salt beef beigel with hot English mustard!" },
      { dish: "Poppies Fish & Chips Shoreditch", cost: "$12/portion", tip: "Nostalgic 1950s-styled dinner. Massive portions of golden-crust cod." },
      { dish: "Borough Market Toasties (Kappacasein)", cost: "$8", tip: "The world's richest three-cheese sourdough melt. Long queues but worth it!" }
    ],
    transport: "Hop on the London Underground (the Tube) or tap your bank card on the red double-decker buses. Grab a public Santander Cycle for just £2!"
  },
  paris: {
    hotels: [
      { name: "Les Piaules Nation Hostel", cost: "~$32/night", tip: "Rooftop bar with panoramic views over Paris and great custom bunk beds." },
      { name: "Le Regent Montmartre Hostel", cost: "~$42/night", tip: "Literally overlooks the Sacré-Cœur! Incredible location and free croissants." },
      { name: "St Christopher's Inn Canal", cost: "~$36/night", tip: "Beautiful waterside deck. Very social atmosphere and cheap happy hours." }
    ],
    food: [
      { dish: "Boulangerie Coquelicot Montmartre", cost: "$2/croissant", tip: "Warm, buttery artisanal croissants. Grab one and sit on Sacré-Cœur steps!" },
      { dish: "L'As du Fallafel (Le Marais)", cost: "$8/wrap", tip: "The world's most famous warm falafel pita. Messy, loaded, and heavenly." },
      { dish: "Bouillon Pigalle", cost: "$14/full meal", tip: "Historic, traditional French bistro serving escargots and steak-frites at unbeatable prices." }
    ],
    transport: "Take the Paris Metro (buy a digital t+ ticket pack). Very fast and dense grid. Walking is incredibly scenic, especially along the Seine."
  },
  sf: {
    hotels: [
      { name: "Green Tortoise Hostel SF", cost: "~$30/night", tip: "Famous social hostel in North Beach. Free dinners on select nights and saunas!" },
      { name: "USA Hostels San Francisco", cost: "~$45/night", tip: "Located near Union Square. Free breakfasts, massive theater rooms, and tours." },
      { name: "HI San Francisco Downtown", cost: "~$42/night", tip: "Clean, ultra-safe, spacious lounges. Offers free walking tours of Chinatown." }
    ],
    food: [
      { dish: "La Taqueria (Mission Burrito)", cost: "$11", tip: "Voted America's best burrito. Get it 'El Dorado' style (seared golden on the grill)." },
      { dish: "Ferry Building Sourdough (Acme)", cost: "$4/loaf", tip: "Freshly baked sourdough baguettes. Pair it with local cheese by the bay." },
      { dish: "Ghirardelli Square Sundae", cost: "$10", tip: "Huge hot fudge sundae with freshly melted premium dark chocolate." }
    ],
    transport: "Use BART trains for crossing the bay, or Muni buses for city transit. Download the Clipper Card app. Cable cars are fun but expensive ($8)!"
  }
};

// ==========================================
// 2. STATE SYNCHRONIZER (LOCAL STORAGE)
// ==========================================

function getStoredData(key, fallback) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}

function setStoredData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Initialize LocalStorage Collections
let events = getStoredData('gathergo_events', INITIAL_EVENTS);
let users = getStoredData('gathergo_users', {});
let currentUser = getStoredData('gathergo_current_user', null);
let rsvps = getStoredData('gathergo_rsvps', {}); // userId -> list of eventIds
let userReviews = getStoredData('gathergo_reviews', {}); // eventId -> list of reviews

// ==========================================
// 3. CORE ROUTING & TAB NAVIGATION
// ==========================================

function initNavigation() {
  const navLinks = document.querySelectorAll('.sidebar-menu a, .sidebar-footer a');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetHash = link.getAttribute('href');

      if (targetHash === '#logout') {
        logoutUser();
        return;
      }

      const targetView = targetHash.replace('#', '');
      switchView(targetView);
    });
  });

  // Mobile Dashboard locked state trigger
  document.getElementById('dashboard-login-btn').addEventListener('click', () => {
    openAuthModal('login');
  });

  // Small profile avatar header click
  document.getElementById('user-profile-badge').addEventListener('click', () => {
    switchView('dashboard');
  });
}

function switchView(viewName) {
  currentView = viewName;

  // Update sidebar active classes
  const navLinks = document.querySelectorAll('.sidebar-menu a');
  navLinks.forEach(link => {
    const hash = link.getAttribute('href').replace('#', '');
    if (hash === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Toggle DOM views
  document.querySelectorAll('.view-section').forEach(section => {
    const sectionId = section.getAttribute('id').replace('view-', '');
    if (sectionId === viewName) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  });

  // Specific view actions
  if (viewName === 'map') {
    // Leaflet map needs resizing triggers when drawn in hidden panels
    setTimeout(() => {
      initLeafletMap();
      renderMapList();
    }, 150);
  } else if (viewName === 'dashboard') {
    renderDashboard();
  } else if (viewName === 'discover') {
    renderDiscoverFeed();
  } else if (viewName === 'ai-travel-chat') {
    initDedicatedChat();
  } else if (viewName === 'globe-view') {
    initGlobeView();
  }

  // Scroll to top
  document.getElementById('app-main-view').scrollTop = 0;
}

// ==========================================
// 3.5 DEDICATED 3D GLOBE EXPLORER
// ==========================================

let myGlobe = null;

async function bootstrapDataset() {
  const hasFrench = events.some(e => e.id.startsWith('evt-french-'));
  if (!hasFrench) {
    try {
      console.log("Fetching french_festivals.json...");
      const response = await fetch('french_festivals.json');
      if (response.ok) {
        const frenchEvents = await response.json();
        // Merge them into the local events array
        events = [...events, ...frenchEvents];
        setStoredData('gathergo_events', events);
        console.log(`Loaded ${frenchEvents.length} French festivals from JSON.`);
      } else {
        console.error("Failed to fetch french_festivals.json");
      }
    } catch (error) {
      console.error("Error bootstrapping dataset:", error);
    }
  }
}

function initGlobeView() {
  const container = document.getElementById('globe-3d');
  if (!container) return;

  if (myGlobe) {
    updateGlobePoints();
    return;
  }

  const width = container.clientWidth;
  const height = container.clientHeight || 500;

  // Initialize the Globe
  myGlobe = Globe()(container)
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
    .showAtmosphere(true)
    .atmosphereColor('#8b5cf6')
    .atmospherePowFactor(3)
    .width(width)
    .height(height);

  // Resize listener
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      if (myGlobe) {
        myGlobe.width(width).height(height || 500);
      }
    }
  });
  resizeObserver.observe(container);

  // Configure Point Pin mapping
  myGlobe
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointColor(d => {
      if (d.category === 'parties') return '#ec4899';
      if (d.category === 'tech') return '#06b6d4';
      if (d.category === 'art') return '#f59e0b';
      return '#10b981'; // community
    })
    .pointAltitude(0.06)
    .pointRadius(0.5)
    .pointsMerge(false)
    .pointLabel(d => {
      const dateObj = new Date(d.date);
      const dateStr = dateObj.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      return `
        <div class="globe-tooltip">
          <div class="globe-tooltip-title">${d.title}</div>
          <div class="globe-tooltip-meta">
            <span><strong>Category:</strong> ${d.category.toUpperCase()}</span>
            <span><strong>Venue:</strong> ${d.venue}</span>
            <span><strong>Date:</strong> ${dateStr}</span>
            <span><strong>Price:</strong> ${d.price === 0 ? 'FREE' : '$' + d.price.toFixed(2)}</span>
          </div>
        </div>
      `;
    })
    .onPointClick(d => {
      openEventDetails(d.id);
    });

  // Enable auto-rotation
  const controls = myGlobe.controls();
  if (controls) {
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = true;
    
    // Disable rotation on user drag
    container.addEventListener('mousedown', () => {
      controls.autoRotate = false;
    });
    container.addEventListener('wheel', () => {
      controls.autoRotate = false;
    });
  }

  // Bind dropdown filter events
  document.getElementById('globe-month-select').addEventListener('change', updateGlobePoints);
  document.getElementById('globe-year-select').addEventListener('change', updateGlobePoints);

  updateGlobePoints();
}

function updateGlobePoints() {
  if (!myGlobe) return;

  const monthSelect = document.getElementById('globe-month-select').value;
  const yearSelect = document.getElementById('globe-year-select').value;

  const filtered = events.filter(evt => {
    // Only display approved events
    if (evt.status && evt.status !== 'approved') return false;

    const dateObj = new Date(evt.date);
    const monthMatch = monthSelect === 'all' || (dateObj.getMonth() + 1).toString() === monthSelect;
    const yearMatch = dateObj.getFullYear().toString() === yearSelect;

    return monthMatch && yearMatch;
  });

  myGlobe.pointsData(filtered);
  document.getElementById('globe-active-count').innerText = filtered.length;
}

// ==========================================
// 4. THEME & STYLING CONTROLLER
// ==========================================

function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  // Read stored or preference
  let currentTheme = localStorage.getItem('gathergo_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeUI(currentTheme);

  toggleBtn.addEventListener('click', () => {
    let activeTheme = document.documentElement.getAttribute('data-theme');
    let nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('gathergo_theme', nextTheme);
    updateThemeUI(nextTheme);
  });
}

function updateThemeUI(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (theme === 'dark') {
    themeIcon.className = 'fa-solid fa-moon';
  } else {
    themeIcon.className = 'fa-solid fa-sun';
  }

  // Redraw map tiles style if map exists
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
    initLeafletMap();
  }
}

// ==========================================
// 5. GEOLOCATION AND FILTERING
// ==========================================

function initFilters() {
  const geoBtn = document.getElementById('geolocation-btn');
  const searchInput = document.getElementById('global-search-input');
  const categoryChips = document.querySelectorAll('.category-chip');
  const sortSelect = document.getElementById('sort-select');

  // Search input typing
  searchInput.addEventListener('input', () => {
    renderDiscoverFeed();
  });

  // Geolocation trigger
  geoBtn.addEventListener('click', () => {
    if (userLocation) {
      // Toggle off
      userLocation = null;
      geoBtn.classList.remove('active');
      document.getElementById('geo-btn-text').innerText = "Nearby";
      document.getElementById('sort-distance-opt').setAttribute('disabled', 'true');
      if (sortSelect.value === 'distance') {
        sortSelect.value = 'upcoming';
      }
      renderDiscoverFeed();
      if (leafletMap) renderMapList();
    } else {
      geoBtn.classList.add('active');
      document.getElementById('geo-btn-text').innerText = "Locating...";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          document.getElementById('geo-btn-text').innerText = "Connected";
          document.getElementById('sort-distance-opt').removeAttribute('disabled');
          sortSelect.value = 'distance'; // auto swap
          renderDiscoverFeed();
          if (leafletMap) {
            initLeafletMap(); // Center map to user
            renderMapList();
          }
        },
        (error) => {
          console.warn("Geolocation failed. Mocking user location to Paris center for demonstration.", error);
          userLocation = { lat: 48.8566, lng: 2.3522 }; // Mock Paris
          document.getElementById('geo-btn-text').innerText = "Paris (Mock)";
          document.getElementById('sort-distance-opt').removeAttribute('disabled');
          sortSelect.value = 'distance';
          renderDiscoverFeed();
          if (leafletMap) {
            initLeafletMap();
            renderMapList();
          }
        }
      );
    }
  });

  // Category quick chips click
  categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderDiscoverFeed();
    });
  });

  // Sorters change
  sortSelect.addEventListener('change', () => {
    renderDiscoverFeed();
  });
}

// Distance computation using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function getFilteredEvents() {
  const searchVal = document.getElementById('global-search-input').value.toLowerCase();
  const activeCategoryChip = document.querySelector('.category-chip.active');
  const activeCategory = activeCategoryChip ? activeCategoryChip.getAttribute('data-category') : 'all';
  const sortSelect = document.getElementById('sort-select').value;

  // Filter listings
  let filtered = events.filter(evt => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchVal) ||
      evt.description.toLowerCase().includes(searchVal) ||
      evt.venue.toLowerCase().includes(searchVal) ||
      evt.city.toLowerCase().includes(searchVal) ||
      evt.organizer.toLowerCase().includes(searchVal);

    const matchesCategory = (activeCategory === 'all') || (evt.category === activeCategory);

    return matchesSearch && matchesCategory;
  });

  // Calculate distance fields dynamically if user coordinates active
  filtered = filtered.map(evt => {
    if (userLocation) {
      evt.distance = calculateDistance(userLocation.lat, userLocation.lng, evt.lat, evt.lng);
    } else {
      evt.distance = null;
    }
    return evt;
  });

  // Sort logic
  if (sortSelect === 'upcoming') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortSelect === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortSelect === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortSelect === 'distance' && userLocation) {
    filtered.sort((a, b) => a.distance - b.distance);
  }

  return filtered;
}

// ==========================================
// 6. CARD RENDERING (DISCOVER FEED)
// ==========================================

function renderDiscoverFeed() {
  const grid = document.getElementById('discover-events-grid');
  const resultsTitle = document.getElementById('results-count-title');
  const filtered = getFilteredEvents();

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="glass-card text-center" style="grid-column: 1/-1; padding: 3rem;">
        <i class="fa-regular fa-calendar-times" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 1rem;"></i>
        <h3>No Events Found</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
          Try refining your search keyword or clearing the quick filters.
        </p>
      </div>
    `;
    resultsTitle.innerText = "No results matches your criteria";
    return;
  }

  resultsTitle.innerText = `Upcoming Events (${filtered.length})`;

  // Populates grid
  filtered.forEach(evt => {
    const dateObj = new Date(evt.date);
    const day = dateObj.getDate();
    const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });
    const formattedPrice = evt.price === 0 ? 'FREE' : `$${evt.price.toFixed(2)}`;
    const distanceText = evt.distance !== null ? `${evt.distance.toFixed(1)} km away` : '';

    const card = document.createElement('article');
    card.className = 'event-card glass-card';
    card.style.padding = '0';
    card.innerHTML = `
      <div class="card-img-container" style="background-image: url('${evt.image}')">
        <span class="card-category-badge badge-${evt.category}">${evt.category}</span>
        <div class="card-date-badge">
          <span class="day">${day}</span>
          <span class="month">${monthStr}</span>
        </div>
      </div>
      <div class="card-info-pane">
        <h3 class="card-title">${evt.title}</h3>
        <div class="card-meta-row">
          <div class="card-meta-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>${evt.venue}</span>
          </div>
        </div>
        <div class="card-meta-row" style="margin-top: 0.25rem;">
          <div class="card-meta-item">
            <i class="fa-solid fa-star" style="color: #fbbf24;"></i>
            <span>${evt.rating.toFixed(1)}</span>
            ${distanceText ? `<span style="color: var(--secondary); font-weight:600; margin-left: 0.5rem;"><i class="fa-solid fa-map-pin"></i> ${distanceText}</span>` : ''}
          </div>
          <span class="card-price-badge ${evt.price === 0 ? 'free' : ''}">${formattedPrice}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openEventDetails(evt.id);
    });

    grid.appendChild(card);
  });

  // Dynamic Featured Banner Setup based on soonest event
  if (filtered.length > 0) {
    const featured = filtered[0];
    const dateObj = new Date(featured.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit' });

    document.getElementById('hero-slide-bg').style.backgroundImage = `url('${featured.image}')`;
    document.getElementById('hero-event-category').innerText = `FEATURED ${featured.category.toUpperCase()}`;
    document.getElementById('hero-event-title').innerText = featured.title;
    document.getElementById('hero-banner-slider').style.cursor = 'pointer';

    // Banner click
    document.getElementById('hero-banner-slider').onclick = () => {
      openEventDetails(featured.id);
    };
  }
}

// ==========================================
// 7. LEAFLET MAP VISUALIZATION
// ==========================================

function initLeafletMap() {
  const mapContainer = document.getElementById('leaflet-map');
  if (!mapContainer) return;

  // Clear existing instance
  if (leafletMap) return;

  const activeTheme = document.documentElement.getAttribute('data-theme');
  const centerCoords = userLocation || DEFAULT_COORDS;

  leafletMap = L.map('leaflet-map').setView([centerCoords.lat, centerCoords.lng], 13);

  // Custom glass map style depending on theme
  let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'; // dark Map tiles
  if (activeTheme === 'light') {
    tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'; // light map tiles
  }

  L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(leafletMap);

  // If user location is active, plot a custom pulsing blue marker
  if (userLocation) {
    const userMarkerIcon = L.divIcon({
      className: 'user-map-pulsar',
      html: `<div style="width: 14px; height: 14px; background: #06b6d4; border: 2px solid #fff; border-radius:50%; box-shadow: 0 0 10px #06b6d4; animation: pulse 1.5s infinite;"></div>`,
      iconSize: [14, 14]
    });
    L.marker([userLocation.lat, userLocation.lng], { icon: userMarkerIcon })
      .addTo(leafletMap)
      .bindPopup("<b>You are here</b>")
      .openPopup();
  }

  // Draw event marker pins
  plotEventMarkers();
}

function plotEventMarkers() {
  // Clear old markers
  mapMarkers.forEach(m => leafletMap.removeLayer(m));
  mapMarkers = [];

  const filtered = getFilteredEvents();

  filtered.forEach(evt => {
    const formattedPrice = evt.price === 0 ? 'FREE' : `$${evt.price.toFixed(2)}`;

    // Custom styled neon glass pins
    const pinColor = evt.category === 'parties' ? '#ec4899' :
      evt.category === 'tech' ? '#06b6d4' :
        evt.category === 'art' ? '#f59e0b' : '#10b981';

    const divIcon = L.divIcon({
      className: 'custom-leaflet-pin',
      html: `<div style="background: ${pinColor}; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display:flex; align-items:center; justify-content:center; border: 2px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"><i class="fa-solid fa-location-dot" style="color: #fff; transform: rotate(45deg); font-size: 0.8rem;"></i></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    });

    const marker = L.marker([evt.lat, evt.lng], { icon: divIcon }).addTo(leafletMap);

    // Popup binding
    const popupHtml = `
      <div class="map-popup-container">
        <div class="map-popup-img" style="background-image: url('${evt.image}')"></div>
        <div class="map-popup-body">
          <h4 class="map-popup-title">${evt.title}</h4>
          <p class="map-popup-loc"><i class="fa-solid fa-map-pin"></i> ${evt.venue}</p>
          <div class="map-popup-footer">
            <span class="map-popup-price">${formattedPrice}</span>
            <button class="map-popup-btn" onclick="openEventDetails('${evt.id}')">View details</button>
          </div>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);
    mapMarkers.push(marker);
  });
}

function renderMapList() {
  const list = document.getElementById('map-sidebar-list');
  const filtered = getFilteredEvents();
  list.innerHTML = '';

  if (filtered.length === 0) {
    list.innerHTML = `<p style="color: var(--text-secondary); text-align:center; padding-top:2rem;">No events in this region.</p>`;
    return;
  }

  filtered.forEach(evt => {
    const distanceText = evt.distance !== null ? `${evt.distance.toFixed(1)} km away` : evt.city;

    const card = document.createElement('div');
    card.className = 'map-card-mini';
    card.innerHTML = `
      <img src="${evt.image}" alt="${evt.title}">
      <div class="map-card-mini-info">
        <h4 class="mini-title">${evt.title}</h4>
        <div>
          <div class="mini-city"><i class="fa-solid fa-map-pin"></i> ${evt.venue}</div>
          <div class="mini-distance">${distanceText}</div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      // Pan map and open popup
      if (leafletMap) {
        leafletMap.setView([evt.lat, evt.lng], 14, { animate: true });
        // Find corresponding marker
        const idx = events.findIndex(e => e.id === evt.id);
        if (mapMarkers[idx]) {
          mapMarkers[idx].openPopup();
        }
      }
    });

    list.appendChild(card);
  });
}

// ==========================================
// 8. EVENT DETAIL MODAL & DRAWER SUB-TABS
// ==========================================

function openEventDetails(eventId) {
  const evt = events.find(e => e.id === eventId);
  if (!evt) return;

  activeEvent = evt;

  // Slide open Modal
  const modal = document.getElementById('event-detail-modal');
  modal.classList.add('active');

  // Fill Header Splash
  document.getElementById('modal-banner').style.backgroundImage = `url('${evt.image}')`;
  document.getElementById('modal-category').innerText = evt.category.toUpperCase();
  document.getElementById('modal-category').className = `card-category-badge badge-${evt.category}`;
  document.getElementById('modal-title').innerText = evt.title;

  // Specs info
  const dateObj = new Date(evt.date);
  document.getElementById('modal-spec-date').innerText = dateObj.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  document.getElementById('modal-spec-venue').innerText = evt.venue;
  document.getElementById('modal-desc').innerText = evt.description;
  document.getElementById('modal-organizer').innerText = evt.organizer;

  const formattedPrice = evt.price === 0 ? 'FREE' : `$${evt.price.toFixed(2)}`;
  document.getElementById('modal-price').innerText = formattedPrice;

  // Render distance tag if geolocation exists
  const distLabel = document.getElementById('modal-distance-label');
  if (userLocation) {
    const dist = calculateDistance(userLocation.lat, userLocation.lng, evt.lat, evt.lng);
    distLabel.innerText = `${dist.toFixed(1)} km away`;
    distLabel.style.display = 'inline-block';
  } else {
    distLabel.style.display = 'none';
  }

  // Update Favorite button heart icon
  updateFavHeartIcon(evt.id);

  // Setup tabs
  initDetailTabs();

  // Reset Sub Panels Content
  setupTransitEstimator();
  setupContextualChatbot();
  setupReviewsPanel();
  updateRsvpsButtonState();
}

function closeEventDetails() {
  document.getElementById('event-detail-modal').classList.remove('active');
  activeEvent = null;
}

function initDetailTabs() {
  const tabBtns = document.querySelectorAll('.drawer-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Set first tab active
  tabBtns.forEach(btn => btn.classList.remove('active'));
  tabPanes.forEach(pane => pane.classList.remove('active'));

  document.querySelector('.drawer-tab[data-tab="tab-overview"]').classList.add('active');
  document.getElementById('tab-overview').classList.add('active');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPaneId = btn.getAttribute('data-tab');
      document.getElementById(targetPaneId).classList.add('active');
    });
  });
}

function updateFavHeartIcon(eventId) {
  const favBtn = document.getElementById('modal-fav-btn');
  if (currentUser) {
    const favorites = getStoredData(`gathergo_favs_${currentUser.email}`, []);
    if (favorites.includes(eventId)) {
      favBtn.innerHTML = '<i class="fa-solid fa-heart" style="color: #ec4899;"></i>';
    } else {
      favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
  } else {
    favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
  }
}

// Favorite Event toggle
document.getElementById('modal-fav-btn').addEventListener('click', () => {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  if (!activeEvent) return;

  const key = `gathergo_favs_${currentUser.email}`;
  let favorites = getStoredData(key, []);

  if (favorites.includes(activeEvent.id)) {
    favorites = favorites.filter(id => id !== activeEvent.id);
  } else {
    favorites.push(activeEvent.id);
  }
  setStoredData(key, favorites);
  updateFavHeartIcon(activeEvent.id);
});

// Modal close binds
document.getElementById('modal-close-btn').addEventListener('click', closeEventDetails);
document.getElementById('event-detail-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('event-detail-modal')) {
    closeEventDetails();
  }
});

// ==========================================
// 9. DYNAMIC TRANSIT WIDGET CALCULATION
// ==========================================

function setupTransitEstimator() {
  const tbody = document.getElementById('transit-tbody');
  const startInput = document.getElementById('transit-start-input');
  const recalculateBtn = document.getElementById('transit-recalc-btn');
  const mapsLink = document.getElementById('modal-gmaps-link');

  if (!activeEvent) return;

  // Set maps routing link
  mapsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${activeEvent.lat},${activeEvent.lng}`;

  // Check start coordinates
  const startCoords = userLocation || DEFAULT_COORDS;
  if (userLocation) {
    startInput.value = "My GPS Location";
  } else {
    startInput.value = "Default Shibuya, Tokyo Center";
  }

  calculateTransitLines(startCoords.lat, startCoords.lng, activeEvent.lat, activeEvent.lng);

  // Manual input recalculation (mock geocoding)
  recalculateBtn.onclick = () => {
    const val = startInput.value.toLowerCase();
    let mockCoords = DEFAULT_COORDS;

    // Very simple city geocoding simulation
    if (val.includes('london')) {
      mockCoords = { lat: 51.5074, lng: -0.1278 };
      startInput.value = "London Center (Simulation)";
    } else if (val.includes('paris')) {
      mockCoords = { lat: 48.8566, lng: 2.3522 };
      startInput.value = "Paris Center (Simulation)";
    } else if (val.includes('sf') || val.includes('francisco')) {
      mockCoords = { lat: 37.7749, lng: -122.4194 };
      startInput.value = "San Francisco Center (Simulation)";
    } else if (val.includes('tokyo') || val.includes('shibuya')) {
      mockCoords = { lat: 35.6895, lng: 139.6917 };
      startInput.value = "Tokyo Shinjuku (Simulation)";
    } else {
      alert("Type a city name (London, Paris, SF, Tokyo) to simulate route changes!");
      return;
    }

    calculateTransitLines(mockCoords.lat, mockCoords.lng, activeEvent.lat, activeEvent.lng);
    mapsLink.href = `https://www.google.com/maps/dir/?api=1&origin=${mockCoords.lat},${mockCoords.lng}&destination=${activeEvent.lat},${activeEvent.lng}`;
  };
}

function calculateTransitLines(lat1, lon1, lat2, lon2) {
  const tbody = document.getElementById('transit-tbody');
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  tbody.innerHTML = '';

  // Mode calculations
  const modes = [
    {
      name: "Walking / Cycling",
      icon: "fa-solid fa-person-walking",
      color: "#10b981",
      duration: `${Math.round(distance / 5 * 60)} mins`,
      cost: "FREE"
    },
    {
      name: "Public Transit (Train/Bus)",
      icon: "fa-solid fa-train-subway",
      color: "#06b6d4",
      duration: `${Math.round(distance / 25 * 60) + 6} mins`,
      cost: `$${(2.20 + (distance * 0.12)).toFixed(2)}`
    },
    {
      name: "Uber / Taxi Rideshare",
      icon: "fa-solid fa-car",
      color: "#8b5cf6",
      duration: `${Math.round(distance / 35 * 60) + 2} mins`,
      cost: `$${(4.50 + (distance * 1.65)).toFixed(2)}`
    },
    {
      name: "Personal Vehicle (Gas)",
      icon: "fa-solid fa-gauge-high",
      color: "#ec4899",
      duration: `${Math.round(distance / 30 * 60)} mins`,
      cost: `$${(distance * 0.14).toFixed(2)} + Parking`
    }
  ];

  modes.forEach(mode => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="font-weight:600; display:flex; align-items:center; gap:0.5rem;"><i class="${mode.icon}" style="color:${mode.color}"></i> ${mode.name}</td>
      <td>${mode.duration}</td>
      <td style="font-weight:700;">${mode.cost}</td>
    `;
    tbody.appendChild(row);
  });
}

// ==========================================
// 10. CONTEXTUAL AI EVENT CONCIERGE CHAT
// ==========================================

function setupContextualChatbot() {
  const stream = document.getElementById('modal-chat-messages');
  const form = document.getElementById('modal-chat-form');
  const input = document.getElementById('modal-chat-input');
  const chipsBar = document.getElementById('modal-chat-chips');

  if (!activeEvent) return;

  stream.innerHTML = '';
  chipsBar.innerHTML = '';

  // Initial welcome message from contextual AI
  const welcomeText = `Hey! I am your Event Concierge for **${activeEvent.title}** here in **${activeEvent.city}**. I can recommend cheap hostels, famous local dishes, and tips on saving transit cash close to **${activeEvent.venue}**. Ask me anything!`;
  appendMessage(stream, 'ai', welcomeText);

  // Create contextual chips based on location
  const chips = ["Cheap hotels near here", "Famous local food to try", "Transit saving tips"];
  chips.forEach(chip => {
    const chipBtn = document.createElement('div');
    chipBtn.className = 'chat-chip';
    chipBtn.innerText = chip;
    chipBtn.onclick = () => {
      input.value = chip;
      triggerContextualResponse(chip);
      input.value = '';
    };
    chipsBar.appendChild(chipBtn);
  });

  // Submit custom messages
  form.onsubmit = (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    appendMessage(stream, 'user', val);
    input.value = '';

    // Simulate AI thinking and outputting
    setTimeout(() => {
      triggerContextualResponse(val);
    }, 500);
  };
}

function appendMessage(streamElement, sender, text) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble bubble-${sender}`;

  // Simplistic markdown parser
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<em>$1</em>');

  bubble.innerHTML = formattedText;
  streamElement.appendChild(bubble);
  streamElement.scrollTop = streamElement.scrollHeight;
}

function triggerContextualResponse(query) {
  const stream = document.getElementById('modal-chat-messages');
  if (!activeEvent) return;

  const cityKey = activeEvent.city.toLowerCase().replace(' ', '');
  const data = TRAVEL_KNOWLEDGE[cityKey] || TRAVEL_KNOWLEDGE.tokyo;
  const q = query.toLowerCase();

  let response = "";

  if (q.includes('hotel') || q.includes('stay') || q.includes('hostel')) {
    response = `Here are 3 top-rated budget accommodations near **${activeEvent.venue}** in **${activeEvent.city}**:\n\n`;
    data.hotels.forEach(h => {
      response += `• **${h.name}** (${h.cost}): ${h.tip}\n`;
    });
  } else if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('cuisine')) {
    response = `You can't miss these famous local dishes and restaurants around **${activeEvent.city}**:\n\n`;
    data.food.forEach(f => {
      response += `• **${f.dish}** (Est. Cost: ${f.cost}): ${f.tip}\n`;
    });
  } else if (q.includes('transit') || q.includes('train') || q.includes('route') || q.includes('saving') || q.includes('tips')) {
    response = `**Transit and Route Tips in ${activeEvent.city}:**\n\n${data.transport}`;
  } else {
    // Generative fallback
    response = `That's a great question about attending **${activeEvent.title}**! As your travel concierge in **${activeEvent.city}**, I highly recommend starting with a local food crawl at **${data.food[0].dish}**, getting a budget card for easy transit, and staying at **${data.hotels[0].name}** to save massive accommodation costs. Let me know if you need specific details!`;
  }

  appendMessage(stream, 'ai', response);
}

// ==========================================
// 11. RATINGS AND REVIEWS SYSTEM
// ==========================================

let activeReviewRating = 5;

function setupReviewsPanel() {
  const starsSelector = document.getElementById('modal-review-stars-selector');
  const reviewForm = document.getElementById('modal-submit-review-form');
  const reviewText = document.getElementById('modal-review-text');

  if (!activeEvent) return;

  // Star selector clicks
  const stars = starsSelector.querySelectorAll('i');

  // Helper to color stars
  function colorStars(rating) {
    stars.forEach(s => {
      const idx = parseInt(s.getAttribute('data-rating'));
      if (idx <= rating) {
        s.className = 'fa-solid fa-star active';
      } else {
        s.className = 'fa-regular fa-star';
      }
    });
  }

  // Set default active star colors
  colorStars(activeReviewRating);

  stars.forEach(star => {
    star.onclick = () => {
      activeReviewRating = parseInt(star.getAttribute('data-rating'));
      colorStars(activeReviewRating);
    };
  });

  // Submit Review Form logic
  reviewForm.onsubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    const reviewContent = reviewText.value.trim();
    if (!reviewContent) return;

    // Create review
    const newRev = {
      user: currentUser.name,
      rating: activeReviewRating,
      comment: reviewContent,
      date: new Date().toISOString().split('T')[0]
    };

    // Save state
    const revs = getStoredData('gathergo_reviews', {});
    if (!revs[activeEvent.id]) {
      revs[activeEvent.id] = [];
    }
    revs[activeEvent.id].unshift(newRev);
    setStoredData('gathergo_reviews', revs);

    // Update event averages in general event store
    const evIdx = events.findIndex(ev => ev.id === activeEvent.id);
    if (evIdx !== -1) {
      const allRevs = revs[activeEvent.id];
      const sum = allRevs.reduce((acc, r) => acc + r.rating, 0);
      events[evIdx].rating = sum / allRevs.length;
      setStoredData('gathergo_events', events);
    }

    // Refresh UI
    reviewText.value = '';
    activeReviewRating = 5;
    colorStars(5);
    setupReviewsPanel();
    renderDiscoverFeed();
  };

  // Populate Reviews List
  populateReviewsList();
}

function populateReviewsList() {
  const revsList = document.getElementById('modal-reviews-list');
  const avgNum = document.getElementById('modal-review-avg');
  const avgStarsDiv = document.getElementById('modal-review-stars-avg');
  const countLbl = document.getElementById('modal-review-count-lbl');
  const tabBtn = document.getElementById('modal-tab-reviews-btn');

  if (!activeEvent) return;

  const revsCollection = getStoredData('gathergo_reviews', {});
  const eventRevs = revsCollection[activeEvent.id] || [];

  // Recalculate displays
  const count = eventRevs.length;
  tabBtn.innerText = `Reviews (${count})`;
  countLbl.innerText = `Based on ${count} review${count === 1 ? '' : 's'}`;

  let sum = 0;
  eventRevs.forEach(r => sum += r.rating);
  const avg = count > 0 ? (sum / count) : activeEvent.rating;

  avgNum.innerText = avg.toFixed(1);

  // Render stars averages
  avgStarsDiv.innerHTML = '';
  const rounded = Math.round(avg);
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('i');
    star.className = i <= rounded ? 'fa-solid fa-star' : 'fa-regular fa-star';
    avgStarsDiv.appendChild(star);
  }

  // Populate review feed list DOM
  revsList.innerHTML = '';
  if (eventRevs.length === 0) {
    revsList.innerHTML = `<p style="color: var(--text-secondary); text-align:center; padding: 1.5rem;">No reviews yet. Be the first to share your experience!</p>`;
    return;
  }

  eventRevs.forEach(rev => {
    const starsHtml = Array.from({ length: 5 }, (_, i) =>
      `<i class="${i < rev.rating ? 'fa-solid' : 'fa-regular'} fa-star" style="color:#fbbf24; font-size:0.8rem; margin-right:2px;"></i>`
    ).join('');

    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <div class="review-item-header">
        <div class="review-user-info">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80" alt="Avatar">
          <div>
            <div class="review-user-name">${rev.user}</div>
            <div>${starsHtml}</div>
          </div>
        </div>
        <span class="review-item-date">${rev.date}</span>
      </div>
      <p class="review-text">${rev.comment}</p>
    `;
    revsList.appendChild(item);
  });
}

// ==========================================
// 12. MOCK TICKET BOOKING & RSVPS
// ==========================================

const mockRsvpBtn = document.getElementById('modal-rsvp-btn');

mockRsvpBtn.addEventListener('click', () => {
  if (!currentUser) {
    openAuthModal('login');
    return;
  }
  if (!activeEvent) return;

  const currentRsvps = getStoredData('gathergo_rsvps', {});
  const userRsvps = currentRsvps[currentUser.email] || [];

  if (userRsvps.includes(activeEvent.id)) {
    // Un-RSVP
    const updated = userRsvps.filter(id => id !== activeEvent.id);
    currentRsvps[currentUser.email] = updated;
    setStoredData('gathergo_rsvps', currentRsvps);
    alert(`Cancelled booking for ${activeEvent.title}`);
    updateRsvpsButtonState();
    renderDashboard();
    return;
  }

  // If paid, emulate checkout
  if (activeEvent.price > 0) {
    emulatePaymentCheckout();
  } else {
    // Direct book
    userRsvps.push(activeEvent.id);
    currentRsvps[currentUser.email] = userRsvps;
    setStoredData('gathergo_rsvps', currentRsvps);
    alert(`Success! You have registered for ${activeEvent.title}`);
    updateRsvpsButtonState();
    renderDashboard();
  }
});

function updateRsvpsButtonState() {
  if (!activeEvent) return;

  if (!currentUser) {
    mockRsvpBtn.innerHTML = `<i class="fa-solid fa-user-lock"></i> Register to Join`;
    mockRsvpBtn.className = 'user-auth-btn btn-primary';
    return;
  }

  const currentRsvps = getStoredData('gathergo_rsvps', {});
  const userRsvps = currentRsvps[currentUser.email] || [];

  if (userRsvps.includes(activeEvent.id)) {
    mockRsvpBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> Cancel Booking`;
    mockRsvpBtn.className = 'user-auth-btn btn-outline';
  } else {
    const text = activeEvent.price === 0 ? "RSVP for Free" : "Book Ticket";
    mockRsvpBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${text}`;
    mockRsvpBtn.className = 'user-auth-btn btn-primary';
  }
}

function emulatePaymentCheckout() {
  if (!activeEvent || !currentUser) return;

  // Custom glassmorphic billing form pop-up dialog
  const overlay = document.createElement('div');
  overlay.className = 'auth-modal-overlay active';
  overlay.style.zIndex = '200';

  overlay.innerHTML = `
    <div class="auth-modal" style="max-width: 450px;">
      <div class="auth-modal-body" style="padding: 1.5rem 2rem;">
        <h3 style="margin-bottom: 0.5rem;"><i class="fa-solid fa-credit-card" style="color:var(--primary)"></i> GatherGo Secure Pay</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom: 1.25rem;">
          Paid ticket payment simulation for <strong>${activeEvent.title}</strong>
        </p>

        <!-- Credit Card Graphic -->
        <div style="background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); border: 1px solid rgba(255,255,255,0.15); border-radius:12px; padding:1.25rem; margin-bottom: 1.25rem; color:#fff; display:flex; flex-direction:column; justify-content:space-between; height: 140px; box-shadow:0 8px 16px rgba(0,0,0,0.3)">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <i class="fa-solid fa-microchip" style="font-size:1.8rem; color:#f59e0b;"></i>
            <span style="font-style:italic; font-weight:800; font-size:0.9rem;">GatherCard</span>
          </div>
          <div style="font-size:1.15rem; font-family:monospace; letter-spacing:3px;">4111 •••• •••• 1234</div>
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#9ca3af;">
            <div>CARDHOLDER<br><span style="color:#fff; font-weight:600;">${currentUser.name.toUpperCase()}</span></div>
            <div style="text-align:right;">EXPIRES<br><span style="color:#fff; font-weight:600;">12 / 28</span></div>
          </div>
        </div>

        <form id="stripe-checkout-form" class="auth-form">
          <div class="form-group">
            <label style="font-size:0.8rem;">Billing Email</label>
            <input type="email" value="${currentUser.email}" readonly>
          </div>
          <div class="form-grid" style="grid-template-columns: 2fr 1fr; margin-top:0;">
            <div class="form-group">
              <label style="font-size:0.8rem;">Card CVC</label>
              <input type="password" required maxlength="3" value="123" placeholder="•••">
            </div>
            <div class="form-group">
              <label style="font-size:0.8rem;">Amount</label>
              <input type="text" value="$${activeEvent.price.toFixed(2)}" readonly style="font-weight:700; color:var(--secondary)">
            </div>
          </div>

          <button type="submit" class="user-auth-btn btn-primary" id="card-pay-btn" style="margin-top: 1rem;">
            Confirm & Pay $${activeEvent.price.toFixed(2)}
          </button>
        </form>
        <button id="card-cancel-btn" class="user-auth-btn btn-outline" style="width: 100%; margin-top: 0.75rem;">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const form = document.getElementById('stripe-checkout-form');
  const cancelBtn = document.getElementById('card-cancel-btn');
  const payBtn = document.getElementById('card-pay-btn');

  cancelBtn.onclick = () => overlay.remove();

  form.onsubmit = (e) => {
    e.preventDefault();
    payBtn.disabled = true;
    payBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Payment...`;

    // Process Delay
    setTimeout(() => {
      overlay.remove();

      // Save RSVP
      const currentRsvps = getStoredData('gathergo_rsvps', {});
      const userRsvps = currentRsvps[currentUser.email] || [];
      userRsvps.push(activeEvent.id);
      currentRsvps[currentUser.email] = userRsvps;
      setStoredData('gathergo_rsvps', currentRsvps);

      alert(`Payment Completed! Ticket generated successfully for ${activeEvent.title}. Check your dashboard schedule!`);

      updateRsvpsButtonState();
      renderDashboard();
    }, 1500);
  };
}

// ==========================================
// 13. DYNAMIC DEDICATED TRAVEL AI CHAT PANELS
// ==========================================

let activeGuideKey = "all-cities";

function initDedicatedChat() {
  const stream = document.getElementById('dedicated-chat-stream');
  const suggestions = document.getElementById('dedicated-chat-suggestions');
  const sidebarGuides = document.querySelectorAll('#chat-tour-guides-list .topic-item');

  // Trigger guide sidebar selection
  sidebarGuides.forEach(item => {
    item.onclick = () => {
      sidebarGuides.forEach(g => g.classList.remove('active'));
      item.classList.add('active');

      activeGuideKey = item.getAttribute('data-guide');
      loadGuideChatCanvas(activeGuideKey);
    };
  });

  // Load default welcome guide
  loadGuideChatCanvas(activeGuideKey);
}

function loadGuideChatCanvas(guideKey) {
  const stream = document.getElementById('dedicated-chat-stream');
  const avatar = document.getElementById('active-guide-avatar');
  const name = document.getElementById('active-guide-name');
  const suggestions = document.getElementById('dedicated-chat-suggestions');
  const input = document.getElementById('dedicated-chat-input');

  const guide = AI_GUIDES[guideKey] || AI_GUIDES["all-cities"];

  stream.innerHTML = '';
  suggestions.innerHTML = '';
  input.value = '';

  avatar.src = guide.avatar;
  name.innerText = guide.name;

  // Append welcome
  appendMessage(stream, 'ai', guide.greeting);

  // Generate Chips suggestions
  let list = ["Suggest top hotels", "What's the best local food?", "Best ways to travel around"];
  if (guideKey === 'all-cities') {
    list = ["Recommend Paris Hostels", "Tokyo Local Ramen spots", "London Tube cost saver"];
  }

  list.forEach(chip => {
    const chipBtn = document.createElement('div');
    chipBtn.className = 'chat-chip';
    chipBtn.innerText = chip;
    chipBtn.onclick = () => {
      input.value = chip;
      sendGlobalChatQuery(chip);
      input.value = '';
    };
    suggestions.appendChild(chipBtn);
  });

  // Form binds
  const chatForm = document.getElementById('dedicated-chat-form');
  chatForm.onsubmit = (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    appendMessage(stream, 'user', query);
    input.value = '';

    setTimeout(() => {
      sendGlobalChatQuery(query);
    }, 500);
  };
}

// Global script handle for suggestion click triggers
window.sendSuggestedChatPrompt = function (promptText) {
  switchView('ai-travel-chat');
  const stream = document.getElementById('dedicated-chat-stream');
  const input = document.getElementById('dedicated-chat-input');

  appendMessage(stream, 'user', promptText);
  setTimeout(() => {
    sendGlobalChatQuery(promptText);
  }, 500);
};

function sendGlobalChatQuery(query) {
  const stream = document.getElementById('dedicated-chat-stream');
  const q = query.toLowerCase();

  // Resolve which city the query refers to
  let cityKey = activeGuideKey;
  if (cityKey === 'all-cities') {
    if (q.includes('tokyo') || q.includes('japan') || q.includes('shibuya')) cityKey = 'tokyo';
    else if (q.includes('london') || q.includes('uk') || q.includes('soho') || q.includes('shoreditch')) cityKey = 'london';
    else if (q.includes('paris') || q.includes('france') || q.includes('marais')) cityKey = 'paris';
    else if (q.includes('sf') || q.includes('francisco') || q.includes('stanford') || q.includes('silicon')) cityKey = 'sf';
    else cityKey = 'tokyo'; // default mock to Tokyo
  }

  const data = TRAVEL_KNOWLEDGE[cityKey];
  let response = "";

  if (q.includes('hotel') || q.includes('hostel') || q.includes('stay') || q.includes('accommodation')) {
    response = `Here are some highly recommended budget hostels and smart hotels in **${cityKey.toUpperCase()}**:\n\n`;
    data.hotels.forEach(h => {
      response += `• **${h.name}** (${h.cost}): ${h.tip}\n`;
    });
  } else if (q.includes('food') || q.includes('eat') || q.includes('cuisine') || q.includes('dish') || q.includes('ramen') || q.includes('burrito')) {
    response = `Here are the top budget-friendly culinary dishes and hotspots you must try in **${cityKey.toUpperCase()}**:\n\n`;
    data.food.forEach(f => {
      response += `• **${f.dish}** (Est. Cost: ${f.cost}): ${f.tip}\n`;
    });
  } else if (q.includes('transit') || q.includes('tube') || q.includes('subway') || q.includes('travel') || q.includes('metro')) {
    response = `**Transit and Transport savings advice for ${cityKey.toUpperCase()}:**\n\n${data.transport}`;
  } else {
    // Generative
    response = `That is an excellent travel query! As your **${cityKey.toUpperCase()}** guide, I highly recommend staying at **${data.hotels[0].name}** (just ${data.hotels[0].cost}), dining at **${data.food[0].dish}**, and using our transit tips: *${data.transport.slice(0, 70)}...* to save massive cash. Ask me another question!`;
  }

  appendMessage(stream, 'ai', response);
}

// ==========================================
// 14. DYNAMIC EVENT CREATION PORTAL
// ==========================================

let activePresetUrl = PRESET_BANNERS[0];

function setupCreateEventPortal() {
  const form = document.getElementById('create-event-form');
  const presetsContainer = document.getElementById('create-banner-presets');

  // Render presets picker
  presetsContainer.innerHTML = '';
  PRESET_BANNERS.forEach((url, i) => {
    const item = document.createElement('div');
    item.className = `image-preset-item ${i === 0 ? 'active' : ''}`;
    item.style.backgroundImage = `url('${url}')`;
    item.onclick = () => {
      document.querySelectorAll('.image-preset-item').forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      activePresetUrl = url;
    };
    presetsContainer.appendChild(item);
  });

  // Submit Publish Event
  form.onsubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Please Sign In first to organize and publish events.");
      openAuthModal('login');
      return;
    }

    const title = document.getElementById('event-create-title').value.trim();
    const desc = document.getElementById('event-create-desc').value.trim();
    const category = document.getElementById('event-create-category').value;
    const price = parseFloat(document.getElementById('event-create-price').value);
    const date = document.getElementById('event-create-date').value;
    const venue = document.getElementById('event-create-venue').value.trim();
    const lat = parseFloat(document.getElementById('event-create-lat').value);
    const lng = parseFloat(document.getElementById('event-create-lng').value);

    // Create event object
    const newEvent = {
      id: `evt-${Date.now()}`,
      title,
      description: desc,
      category,
      price,
      date,
      venue,
      city: venue.split(',').pop().trim(),
      lat,
      lng,
      organizer: currentUser.name,
      rating: 5.0,
      image: activePresetUrl,
      reviews: []
    };

    // Save state
    events.unshift(newEvent);
    setStoredData('gathergo_events', events);

    // Add to organized list in user dashboard count
    const orgKey = `gathergo_organized_${currentUser.email}`;
    const userOrg = getStoredData(orgKey, []);
    userOrg.push(newEvent.id);
    setStoredData(orgKey, userOrg);

    alert(`Congratulations! Event "${title}" has been successfully published.`);

    // Clear form
    form.reset();
    activePresetUrl = PRESET_BANNERS[0];
    document.querySelectorAll('.image-preset-item').forEach((p, idx) => {
      if (idx === 0) p.classList.add('active');
      else p.classList.remove('active');
    });

    // Re-render and navigate
    renderDiscoverFeed();
    switchView('discover');
  };
}

// ==========================================
// 15. USER DASHBOARD PANEL RENDERER
// ==========================================

function renderDashboard() {
  const lockedState = document.getElementById('dashboard-locked-state');
  const activeState = document.getElementById('dashboard-active-state');

  const attendingList = document.getElementById('dashboard-attending-list');
  const organizedList = document.getElementById('dashboard-organized-list');

  const statRsvps = document.getElementById('dashboard-stat-rsvps');
  const statReviews = document.getElementById('dashboard-stat-reviews');
  const statOrganized = document.getElementById('dashboard-stat-organized');

  if (!currentUser) {
    lockedState.style.display = 'flex';
    activeState.style.display = 'none';
    return;
  }

  lockedState.style.display = 'none';
  activeState.style.display = 'grid';

  // Set Profile Fields
  document.getElementById('dashboard-user-display').innerText = currentUser.name;
  document.getElementById('dashboard-user-email').innerText = currentUser.email;

  // Retrieve RSVPs and Organized
  const userRsvps = getStoredData('gathergo_rsvps', {})[currentUser.email] || [];
  const userOrg = getStoredData(`gathergo_organized_${currentUser.email}`, []);

  // Count reviews submitted by this user
  const reviewsCollection = getStoredData('gathergo_reviews', {});
  let reviewCount = 0;
  Object.values(reviewsCollection).forEach(revList => {
    revList.forEach(r => {
      if (r.user === currentUser.name) reviewCount++;
    });
  });

  // Set stats counts
  statRsvps.innerText = userRsvps.length;
  statReviews.innerText = reviewCount;
  statOrganized.innerText = userOrg.length;

  // RENDER ATTENDING LIST
  attendingList.innerHTML = '';
  if (userRsvps.length === 0) {
    attendingList.innerHTML = `
      <div style="text-align:center; padding: 2rem; color: var(--text-secondary);">
        <i class="fa-solid fa-hourglass-empty" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <p>You have not registered for any events yet. Browse our feed and join a party!</p>
      </div>
    `;
  } else {
    userRsvps.forEach(evtId => {
      const evt = events.find(e => e.id === evtId);
      if (!evt) return;

      const dateObj = new Date(evt.date);
      const day = dateObj.getDate();
      const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });

      const item = document.createElement('div');
      item.className = 'schedule-item';
      item.innerHTML = `
        <div class="schedule-date-badge">
          <span class="day">${day}</span>
          <span class="month">${monthStr}</span>
        </div>
        <div class="schedule-info">
          <div class="schedule-title">${evt.title}</div>
          <div class="schedule-loc"><i class="fa-solid fa-map-pin"></i> ${evt.venue}</div>
        </div>
        <button class="schedule-ticket-btn" onclick="printRsvpTicket('${evt.id}')">
          <i class="fa-solid fa-print"></i> Get Ticket
        </button>
      `;
      attendingList.appendChild(item);
    });
  }

  // RENDER ORGANIZED LIST
  organizedList.innerHTML = '';
  if (userOrg.length === 0) {
    organizedList.innerHTML = `
      <p style="color:var(--text-secondary); text-align:center; padding: 1.5rem 0;">
        You haven't organized any events yet. Head over to the 'Organize Event' tab!
      </p>
    `;
  } else {
    userOrg.forEach(evtId => {
      const evt = events.find(e => e.id === evtId);
      if (!evt) return;

      const dateObj = new Date(evt.date);
      const day = dateObj.getDate();
      const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });

      const item = document.createElement('div');
      item.className = 'schedule-item';
      item.innerHTML = `
        <div class="schedule-date-badge" style="background:var(--secondary-glow); color:var(--secondary); border-color:rgba(6,182,212,0.2)">
          <span class="day">${day}</span>
          <span class="month">${monthStr}</span>
        </div>
        <div class="schedule-info">
          <div class="schedule-title">${evt.title}</div>
          <div class="schedule-loc"><i class="fa-solid fa-map-pin"></i> ${evt.venue}</div>
        </div>
        <span class="card-price-badge" style="background:rgba(255,255,255,0.03); border:1px solid var(--panel-border);">Organizing</span>
      `;
      organizedList.appendChild(item);
    });
  }
}

// Emulate printing/rendering ticket PDF mockup in dashboard
window.printRsvpTicket = function (eventId) {
  const evt = events.find(e => e.id === eventId);
  if (!evt || !currentUser) return;

  const overlay = document.createElement('div');
  overlay.className = 'auth-modal-overlay active';
  overlay.style.zIndex = '200';

  const ticketNo = `GG-${Math.floor(100000 + Math.random() * 900000)}`;

  overlay.innerHTML = `
    <div class="auth-modal" style="max-width: 500px;">
      <div class="auth-modal-body">
        <h3 style="margin-bottom:1rem; text-align:center;"><i class="fa-solid fa-circle-check" style="color:#10b981"></i> Official Boarding Pass</h3>
        
        <div class="ticket-pdf-mock">
          <div class="ticket-header">
            <div>
              <strong>GATHERGO EVENTS</strong><br>
              <span style="font-size:0.75rem; color:#666;">PLATFORM PASS</span>
            </div>
            <div style="text-align:right;">
              <strong>NO: ${ticketNo}</strong><br>
              <span style="font-size:0.75rem; color:#666;">SEAT: GENERAL</span>
            </div>
          </div>
          
          <div class="ticket-body">
            <div style="margin-bottom:0.75rem;">
              <span style="font-size:0.7rem; color:#888; text-transform:uppercase;">Event Name</span><br>
              <strong style="font-size:1rem;">${evt.title.toUpperCase()}</strong>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem; margin-bottom:1rem;">
              <div>
                <span style="font-size:0.7rem; color:#888;">DATE & TIME</span><br>
                <strong>${new Date(evt.date).toLocaleString()}</strong>
              </div>
              <div>
                <span style="font-size:0.7rem; color:#888;">PASSENGER</span><br>
                <strong>${currentUser.name.toUpperCase()}</strong>
              </div>
            </div>

            <div style="margin-bottom:1rem;">
              <span style="font-size:0.7rem; color:#888;">VENUE ADDRESS</span><br>
              <strong>${evt.venue}</strong>
            </div>
          </div>

          <div class="ticket-barcode"></div>
        </div>

        <p style="font-size:0.75rem; color:var(--text-secondary); text-align:center; margin-top:1rem;">
          Screenshot or print this pass. Show QR code / barcode at the venue check-in desk.
        </p>

        <button id="close-ticket-btn" class="user-auth-btn btn-primary" style="width: 100%; margin-top: 1rem;">
          Done
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById('close-ticket-btn').onclick = () => overlay.remove();
};

// ==========================================
// 16. AUTHENTICATION (LOGIN / REGISTER)
// ==========================================

function openAuthModal(defaultTab = 'login') {
  const overlay = document.getElementById('auth-modal-overlay');
  overlay.classList.add('active');
  switchAuthTab(defaultTab);
}

function closeAuthModal() {
  document.getElementById('auth-modal-overlay').classList.remove('active');
}

function switchAuthTab(tabName) {
  const tabLogin = document.getElementById('auth-tab-login');
  const tabReg = document.getElementById('auth-tab-register');
  const formLogin = document.getElementById('auth-login-form');
  const formReg = document.getElementById('auth-register-form');

  if (tabName === 'login') {
    tabLogin.classList.add('active');
    tabReg.classList.remove('active');
    formLogin.classList.remove('hidden');
    formReg.classList.add('hidden');
  } else {
    tabLogin.classList.remove('active');
    tabReg.classList.add('active');
    formLogin.classList.add('hidden');
    formReg.classList.remove('hidden');
  }
}

function initAuthHandlers() {
  const loginTrigger = document.getElementById('login-trigger-btn');
  const authClose = document.getElementById('auth-close-btn');
  const tabLogin = document.getElementById('auth-tab-login');
  const tabReg = document.getElementById('auth-tab-register');

  const formLogin = document.getElementById('auth-login-form');
  const formReg = document.getElementById('auth-register-form');

  loginTrigger.addEventListener('click', () => openAuthModal('login'));
  authClose.addEventListener('click', closeAuthModal);
  tabLogin.addEventListener('click', () => switchAuthTab('login'));
  tabReg.addEventListener('click', () => switchAuthTab('register'));

  // Close when clicking overlay backdrop
  document.getElementById('auth-modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('auth-modal-overlay')) {
      closeAuthModal();
    }
  });

  // Sign In submit
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    const registeredUsers = getStoredData('gathergo_users', {});
    const match = registeredUsers[email];

    if (match && match.password === pass) {
      currentUser = { email, name: match.name };
      setStoredData('gathergo_current_user', currentUser);

      closeAuthModal();
      formLogin.reset();
      updateAuthUIState();

      // Auto redirect to schedule
      switchView('dashboard');
    } else {
      alert("Invalid email or password combination. Try again or register a new account!");
    }
  });

  // Register submit
  formReg.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const pass = document.getElementById('register-password').value;

    const registeredUsers = getStoredData('gathergo_users', {});

    if (registeredUsers[email]) {
      alert("An account with this email address already exists.");
      return;
    }

    // Save new user
    registeredUsers[email] = { name, password: pass };
    setStoredData('gathergo_users', registeredUsers);

    // Auto login
    currentUser = { email, name };
    setStoredData('gathergo_current_user', currentUser);

    closeAuthModal();
    formReg.reset();
    updateAuthUIState();

    alert(`Account created successfully! Welcome to GatherGo, ${name}!`);
    switchView('dashboard');
  });
}

function updateAuthUIState() {
  const loginTrigger = document.getElementById('login-trigger-btn');
  const profileBadge = document.getElementById('user-profile-badge');
  const logoutBtn = document.getElementById('nav-logout');
  const nameSmall = document.getElementById('user-name-small');

  if (currentUser) {
    loginTrigger.style.display = 'none';
    profileBadge.style.display = 'flex';
    logoutBtn.style.display = 'flex';
    nameSmall.innerText = currentUser.name;

    // Sync large avatar in dashboard if visible
    const dashAvatar = document.getElementById('dashboard-avatar-img');
    if (dashAvatar) {
      const customAvatar = localStorage.getItem(`gathergo_avatar_${currentUser.email}`);
      dashAvatar.src = customAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
    }
  } else {
    loginTrigger.style.display = 'block';
    profileBadge.style.display = 'none';
    logoutBtn.style.display = 'none';
  }

  // Update Detail modal buttons state
  updateRsvpsButtonState();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('gathergo_current_user');
  updateAuthUIState();
  switchView('discover');
  alert("Signed out successfully.");
}

// User Profile Dashboard custom photo upload emulation
function initAvatarUpload() {
  const uploadInput = document.getElementById('avatar-upload');
  if (!uploadInput) return;

  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;

      // Store custom avatar locally
      localStorage.setItem(`gathergo_avatar_${currentUser.email}`, dataUrl);

      // Update UI
      document.getElementById('dashboard-avatar-img').src = dataUrl;
      document.getElementById('user-avatar-small').src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

// ==========================================
// 17. BOOTSTRAP INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initNavigation();
  initFilters();
  initAuthHandlers();
  setupCreateEventPortal();
  initAvatarUpload();

  // Update Header auth state on boot
  updateAuthUIState();

  // Load and bootstrap French festivals dataset
  await bootstrapDataset();

  // Load first feed
  renderDiscoverFeed();
});
