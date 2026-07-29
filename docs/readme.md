Local Event Finder

Description:

Local Event Finder is an AI-powered web application that helps users discover nearby events based on their location, interests, categories, and preferences.

The platform supports cultural festivals, music concerts, technology meetups, food events, art programs, community gatherings, and regional celebrations. It provides personalized event suggestions, smart search, interactive maps, user authentication, saved schedules, and event-management tools.

The project uses a modern Vanilla JavaScript frontend with a FastAPI backend, SQLAlchemy, and SQLite.

Key Features:

📍 Location-based event recommendations🤖 Smart and personalized event suggestions🎭 Cultural festivals, concerts, art, food, technology, and community events🔍 Smart search, category filtering, and sorting🗺️ Interactive event map using Leaflet.js📅 Event dates, locations, organizers, and participation details🔖 Save events and create a personal schedule👤 User registration and login🛡️ Separate administrator login and dashboard➕ Create and publish new events🌙 Dark and light theme support📱 Responsive design for desktop, tablet, and mobile🌍 Multi-dataset integration for diverse event coverage

Team

Role

Name

Product Owner & Developer

Nai Brahmana Mohan Kumar

Scrum Master & Developer

Deeksith Shankar

Developer

Samba Shiva Rao

Developer

Ahmad Alisha

Developer

Mothadi Venkata Sai Raghu

Project Overview

Local Event Finder is a dynamic event-discovery web application designed to help users find, explore, save, and organize local and international events.

The application includes a curated discovery feed, an interactive map finder, event-organization tools, user and administrator authentication, saved schedules, and a smart local event assistant.

The project combines a modern and responsive user interface with a FastAPI REST backend for storing, retrieving, and managing event information.

Architecture

The application uses a client-server architecture.

The frontend communicates with the FastAPI backend using the Fetch API and JSON. The backend uses SQLAlchemy to manage data stored in an SQLite database.

Web Browser
    |
    | HTTP Requests / JSON
    v
HTML, CSS, and Vanilla JavaScript Frontend
    |
    | REST API
    v
FastAPI Backend
    |
    | SQLAlchemy ORM
    v
SQLite Database

User and administrator authentication is handled using JWT access tokens and securely hashed passwords.

Tech Stack

HTML5: Provides the semantic structure of the application.

CSS3 (Vanilla): Used for responsive layouts, animations, glassmorphism components, Aurora-style colors, and dark/light theme support.

JavaScript (Vanilla JS): Handles search, filtering, sorting, event rendering, authentication, API requests, saved schedules, modals, and interface interactions.

FastAPI: Provides the backend REST API for events, user registration, user login, administrator login, and protected account information.

SQLAlchemy: Manages database models, queries, and communication between FastAPI and SQLite.

SQLite: Stores event and user information during local development.

Pydantic: Validates API requests and responses.

Leaflet.js: Renders the interactive map and displays event location markers.

OpenStreetMap: Provides map tiles for the Leaflet map.

JWT Authentication: Protects user and administrator sessions.

Argon2 Password Hashing: Securely hashes user and administrator passwords.

Python: Used for backend development, dataset preparation, inspection, cleaning, and importing event records.

Main Modules

Discover Feed: Displays featured and recommended events.

Map Finder: Shows events on an interactive map using latitude and longitude.

My Schedule: Stores the events saved by the user.

Organize Event: Allows new event information to be submitted to the backend.

City Assistant: Suggests events using categories, locations, and search terms.

User Portal: Provides registration, login, and protected user access.

Admin Portal: Provides role-protected administrator access and management-ready pages.

Getting Started

To run Local Event Finder, you will need:

Python 3.10 or later

Git

A modern web browser such as Chrome, Firefox, Safari, or Edge

PowerShell, Command Prompt, or another terminal

Run Locally

1. Clone the Repository

git clone https://github.com/mohan123548/Local-Event-finder.git
cd Local-Event-finder

2. Set Up the Backend

Open the backend folder:

cd backend

Create a virtual environment:

python -m venv venv

Activate the virtual environment on Windows:

.\venv\Scripts\Activate.ps1

Install the required packages:

python -m pip install -r requirements.txt

When the authentication packages are not already included, install them using:

python -m pip install PyJWT "pwdlib[argon2]" email-validator

Start the FastAPI backend:

python -m uvicorn app.main:app --reload --port 8001

Open the API documentation:

http://127.0.0.1:8001/docs

3. Set Up the Frontend

Open another terminal and enter the frontend folder:

cd frontend

Start the frontend server:

python -m http.server 5500

Open the application:

http://127.0.0.1:5500

4. Open the Login Pages

User login:

http://127.0.0.1:5500/user-login.html

User registration:

http://127.0.0.1:5500/register.html

Administrator login:

http://127.0.0.1:5500/admin-login.html

Create an Administrator Account

Run the following command from the backend folder:

.\venv\Scripts\python.exe -m app.create_admin `
  --name "Administrator" `
  --email "admin@example.com" `
  --password "ChangeThis123!"

Use a strong password and do not upload real administrator credentials to GitHub.

API Endpoints

Event Endpoints

Method

Endpoint

Description

GET

/api/events

Retrieve all events

POST

/api/events

Create a new event

GET

/api/events/{event_id}

Retrieve one event

PUT

/api/events/{event_id}

Update an event

DELETE

/api/events/{event_id}

Delete an event

Authentication Endpoints

Method

Endpoint

Description

POST

/api/auth/register

Register a new user

POST

/api/auth/user-login

Sign in as a user

POST

/api/auth/admin-login

Sign in as an administrator

GET

/api/auth/me

Retrieve the authenticated account

Repository Structure

Local-Event-finder/
├── frontend/
│   ├── index.html                  # Main application page
│   ├── user-login.html             # User login page
│   ├── admin-login.html            # Administrator login page
│   ├── register.html               # User registration page
│   ├── user-home.html              # Protected user page
│   ├── admin-dashboard.html        # Protected administrator page
│   ├── styles.css                  # Main application styles
│   ├── auth.css                    # Authentication page styles
│   ├── app.js                      # Main frontend logic
│   ├── auth.js                     # Registration and login logic
│   ├── dashboard.js                # Protected page verification
│   └── assets/                     # Logos and event images
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── database.py             # Database connection
│   │   ├── models.py               # Event database models
│   │   ├── schemas.py              # Event validation schemas
│   │   ├── auth_models.py          # User database model
│   │   ├── auth_schemas.py         # Authentication schemas
│   │   ├── auth_security.py        # Password and JWT security
│   │   ├── create_admin.py         # Administrator creation script
│   │   └── routers/
│   │       ├── events.py            # Event API routes
│   │       └── auth.py              # Authentication API routes
│   ├── requirements.txt
│   ├── .env.example
│   └── events.db
│
├── data/
│   ├── french_festivals.json
│   ├── dataset_info.json
│   └── dataset_values_summary.json
│
├── scripts/
│   ├── explore_values.py
│   ├── inspect_dataset.py
│   └── parse_dataset.py
│
└── README.md

Dataset Integration

The application can use multiple event datasets containing:

Event title

Event description

Category

Start and end dates

City

Venue

Latitude and longitude

Organizer

Event image

Source URL

Participation guidelines

Python scripts inside the scripts folder can be used to inspect, clean, transform, and import event information.

Smart Recommendation Approach

The current application can provide event suggestions using:

Search keywords

Selected categories

User location

Event city

Event date

Event description

Saved-event preferences

The recommendation system can later be improved using:

Content-based recommendation

Event classification

Similarity scoring

User preference profiles

Collaborative filtering

Machine-learning ranking models

Security

The current project includes:

Password hashing

JWT authentication

User and administrator roles

Protected dashboard pages

Input validation

CORS configuration

For production deployment, the following should be added:

HTTPS

Secure HttpOnly cookies

CSRF protection

Login rate limiting

Account lockout

Password-reset email workflow

Audit logs

Refresh-token rotation

Production database configuration

Git Workflow

Each team member should work on a separate branch.

Create a branch:

git switch -c feature/feature-name

Add and commit changes:

git add .
git commit -m "Add feature description"

Push the branch:

git push -u origin feature/feature-name

Create a pull request on GitHub and merge it only after review.

Avoid deleting files, rewriting history, or force-pushing directly to the main branch.

Future Improvements

Real machine-learning recommendation model

User preference questionnaire

Email verification

Password-reset system

Google authentication

Event approval workflow

Event image upload

Notification system

Calendar integration

Advanced analytics

PostgreSQL production database

Docker deployment

Cloud hosting

Documentation

The source code is organized into clear modules.

frontend/app.js: Contains event loading, filtering, sorting, map logic, saved schedules, modals, and event creation.

frontend/auth.js: Contains user registration and user/administrator login logic.

frontend/dashboard.js: Verifies JWT sessions and protects user and administrator pages.

backend/app/routers/events.py: Contains event API routes.

backend/app/routers/auth.py: Contains registration, login, and authenticated-user routes.

scripts/: Contains Python utilities for inspecting and preparing event datasets.

Project Status

Local Event Finder is currently under active development.

The current version includes the event-discovery interface, FastAPI backend, SQLite database, interactive map, user registration, user login, administrator authentication, saved schedules, search, filtering, and event creation.
