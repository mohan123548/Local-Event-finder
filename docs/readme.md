# International Student Assistant

> A web app that helps new students to know events and Hackathons and also posting events  in Germany.

## Team

| Role | Name |
|---|---|
| Product Owner  & Developer | Nai Brahmana Mohan Kumar |
| Scrum Master & Developer |  Deeksith Shankar |
| Developer | Samba Shiva Rao  |
| Developer | Ahmad Alisha |
| Developer |Mothadi Venkata Sai Raghu|

## Project Overview

The **Local Event Finder** is a web-based application designed to help users easily discover nearby events such as social gatherings, cultural programs, workshops, and community activities. The platform provides personalized event recommendations, location-based search, and event details in a simple and user-friendly interface. It aims to connect people with local communities and make event exploration faster, easier, and more accessible.

## Architecture


The **Local Event Finder** project follows a client-server architecture where the frontend is developed using **HTML, CSS, and JavaScript** for user interaction, the backend is built with **Python Flask** to handle application logic and API requests, **MongoDB** is used for storing event and user data, and external APIs are integrated to provide real-time event and location-based information.

```
service-a  ──►  service-b
    │
    ▼
  database
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML , CSS , JAVASCRIPT|
| Backend |PYTHON FLASK |
| Database |MongoDB |
| Deployment | |

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed
- Git

### Run locally

```bash
git clone https://github.com/<your-org>/<your-repo>.git
cd <your-repo>
cp .env.example .env   # fill in your values
docker compose up --build
```

The app will be available at `http://localhost:8080`.

## Repository Structure

```
├── README.md
├── .gitignore
├── docs/
│   └── vision.md
|   └── Sessionlogs     # Session logs,Updates  stories
|   └── Untitled-1.html #files structure        
├── services/
│   ├── service-a/           # First microservice
│   └── service-b/           # Second microservice
└── docker-compose.yml
```

## Documentation

- [Vision Document](docs/vision.md)


## License

MIT
