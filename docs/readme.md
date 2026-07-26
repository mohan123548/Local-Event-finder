# Local Events Finder (Gather Go)

# Description:

Local Event Finder is an AI-powered web application that helps users discover events based on their location, interests, and preferences. The platform aggregates data from multiple event datasets, including cultural festivals, music concerts, community gatherings, and regional celebrations, to provide personalized event recommendations. It uses machine learning techniques to classify and rank events, making it easier for users to find relevant activities while learning about local cultures and event guidelines.

# Key Features:

📍 Location-based event recommendations
🤖 AI-powered personalized event suggestions
🎭 Support for cultural festivals, concerts, and community events
🔍 Smart search and event filtering
📅 Event details, dates, locations, and participation guidelines
🌍 Multi-dataset integration for diverse event coverage

## Team

| Role | Name |
|---|---|
| Product Owner  & Developer | Nai Brahmana Mohan Kumar |
| Scrum Master & Developer |  Deeksith Shankar |
| Developer | Samba Shiva Rao  |
| Developer | Ahmad Alisha |
| Developer |Mothadi Venkata Sai Raghu|

## Project Overview
GatherGo is a dynamic, frontend-focused web application designed to help users discover, map, and organize local and international events. Features include a curated discover feed, an interactive map finder, event organization tools, and an AI travel concierge interface. It seamlessly blends modern UI aesthetics with practical event-finding functionality.

## Architecture
The application is built using a purely client-side architecture. It leverages Vanilla JavaScript for all core logic, DOM manipulation, and state management without the overhead of heavy frontend frameworks. Data persistence (such as user sessions and avatars) is managed via the browser's `localStorage`. Event data is loaded dynamically using the Fetch API from local JSON datasets, keeping the application fast and responsive.

## Tech Stack
* **HTML5**: Semantic structure of the application.
* **CSS3 (Vanilla)**: Custom styling, responsive layouts, glassmorphism UI elements, and dynamic theme toggling (Dark/Light mode) using CSS variables.
* **JavaScript (Vanilla JS)**: Core engine for routing, data fetching, user authentication emulation, and interactive map logic.
* **Leaflet.js**: Used for the "Map Finder" view to render interactive maps and plot event coordinate pins.
* **Python**: Used for data preparation scripts to parse, inspect, and explore JSON datasets.

## Getting Started
To get started with GatherGo, you will need:
* A modern web browser (Chrome, Firefox, Safari, Edge).
* Python 3 installed on your machine (to run a local HTTP server).
* Git (to clone the repository).

## Run Locally
1. **Clone the repository:**
   ```bash
   git clone git@github.com:mohan123548/Local-Event-finder.git
   cd Local-Event-finder
   ```

2. **Start a local web server:**
   Since the application fetches local JSON files, running it through a web server is required to avoid CORS (Cross-Origin Resource Sharing) restrictions.
   ```bash
   python -m http.server 8000
   ```
   *(Alternatively, if you use Node.js, you can run `npx serve`)*

3. **View the Application:**
   Open your browser and navigate to:
   [http://localhost:8000](http://localhost:8000)

## Repository Structure

```text
Local-Event-finder/
├── index.html                  # Main application entry point
├── css/                        # Stylesheets
│   └── index.css               # Core styling and themes
├── js/                         # JavaScript source files
│   └── app.js                  # Main application logic and data handling
├── data/                       # Datasets
│   ├── french_festivals.json   # JSON dataset of events
│   ├── dataset_info.json       # Metadata for datasets
│   └── dataset_values_summary.json
├── scripts/                    # Python data processing scripts
│   ├── explore_values.py
│   ├── inspect_dataset.py
│   └── parse_dataset.py
└── README.md                   # Project documentation
```

## Documentation
The source code is heavily documented internally.
* **`js/app.js`**: Contains the core logic separated into distinct sections (Data State, Initialization, Views, Maps, Auth, etc.).
* **`scripts/`**: These Python scripts can be executed manually via the terminal if you wish to parse or manipulate new JSON datasets before introducing them to the frontend `data/` folder.


