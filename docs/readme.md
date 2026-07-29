<div align="center">

🌍 Local Event Finder

Discover nearby events. Build your schedule. Experience your city.

A modern event-discovery platform for finding cultural festivals, music concerts, technology meetups, food events, art programs, and community gatherings.

<br>



<br>

Features •Architecture •Installation •API •Team •Roadmap

</div>

✨ About the Project

Local Event Finder helps users discover events based on location, category, interests, and preferences.

The application combines a responsive Vanilla JavaScript frontend with a FastAPI backend. It supports event discovery, interactive maps, search and filtering, authentication, saved schedules, event creation, and a recommendation-ready interface.

The project is designed for academic learning and can be expanded with real machine-learning recommendation models in future versions.

🚀 Features

<table>
<tr>
<td width="50%" valign="top">

🔎 Smart Event Discovery

Search by title, city, category, venue, or organizer

Filter events by category

Sort events by date or title

Switch between grid and list layouts

Explore featured and recommended events

</td>
<td width="50%" valign="top">

📍 Location and Maps

Browser-based geolocation

Nearby-event distance calculation

Leaflet.js interactive map

Event markers using latitude and longitude

Automatic map positioning

</td>
</tr>

<tr>
<td width="50%" valign="top">

👤 User Experience

User registration and login

Saved-event schedule

Protected member area

Password visibility controls

Responsive mobile interface

</td>
<td width="50%" valign="top">

🛡️ Administrator Access

Separate administrator login

Role-based authorization

Protected admin dashboard

Event-management-ready interface

User and analytics sections

</td>
</tr>

<tr>
<td width="50%" valign="top">

🎨 Modern Interface

Aurora-inspired visual theme

Glassmorphism components

Dark and light modes

Animated interactions

Desktop, tablet, and mobile support

</td>
<td width="50%" valign="top">

🧠 Recommendation Ready

Category-based suggestions

Search-term matching

City-aware recommendations

Saved-event preference support

Architecture ready for ML ranking

</td>
</tr>
</table>

🖥️ Application Modules

Module

Purpose

Discover

Browse featured and recommended events

Map Finder

View events geographically using Leaflet

My Schedule

Access bookmarked events

Organize Event

Create and publish new events

City Assistant

Suggest events using available event data

User Portal

Registration, login, and protected member access

Admin Portal

Role-protected administrator dashboard

🏗️ Architecture

flowchart LR
    A[Web Browser] --> B[HTML / CSS / Vanilla JavaScript]
    B -->|Fetch API / JSON| C[FastAPI REST API]
    C --> D[SQLAlchemy ORM]
    D --> E[(SQLite Database)]
    B --> F[Leaflet.js]
    F --> G[OpenStreetMap]
    C --> H[JWT Authentication]

Frontend

HTML5

CSS3

Vanilla JavaScript

Leaflet.js

Font Awesome

Fetch API

Browser Geolocation API

LocalStorage and SessionStorage

Backend

Python

FastAPI

SQLAlchemy

Pydantic

SQLite

Uvicorn

JWT authentication

Argon2 password hashing

🧰 Technology Stack

Technology

Usage

HTML5

Semantic application structure

CSS3

Responsive design, animation, themes, and glassmorphism

Vanilla JavaScript

UI logic, filtering, routing, API calls, and state

FastAPI

REST API and backend services

SQLAlchemy

Database models and queries

SQLite

Local development database

Pydantic

Request and response validation

Leaflet.js

Interactive map rendering

OpenStreetMap

Map tiles

JWT

Authentication tokens

Argon2

Secure password hashing

Python

Backend and dataset-preparation scripts

📁 Repository Structure

Local-Event-finder/
│
├── frontend/
│   ├── index.html
│   ├── user-login.html
│   ├── admin-login.html
│   ├── register.html
│   ├── user-home.html
│   ├── admin-dashboard.html
│   ├── styles.css
│   ├── auth.css
│   ├── app.js
│   ├── auth.js
│   ├── dashboard.js
│   │
│   └── assets/
│       ├── logo-mark.svg
│       ├── event-music.svg
│       ├── event-tech.svg
│       ├── event-art.svg
│       ├── event-food.svg
│       └── event-community.svg
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth_models.py
│   │   ├── auth_schemas.py
│   │   ├── auth_security.py
│   │   ├── create_admin.py
│   │   │
│   │   └── routers/
│   │       ├── events.py
│   │       └── auth.py
│   │
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

The exact file names may vary depending on the current development branch.

⚡ Getting Started

Prerequisites

Install the following:

Python 3.10 or later

Git

A modern web browser

PowerShell, Command Prompt, or another terminal

1. Clone the Repository

git clone https://github.com/mohan123548/Local-Event-finder.git
cd Local-Event-finder

🔧 Backend Setup

Open a terminal inside the backend folder:

cd backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

.\venv\Scripts\Activate.ps1

Install dependencies:

python -m pip install -r requirements.txt

Install authentication dependencies when they are not already included:

python -m pip install PyJWT "pwdlib[argon2]" email-validator

Start FastAPI:

python -m uvicorn app.main:app --reload --port 8001

Service

Address

Backend

http://127.0.0.1:8001

Swagger API documentation

http://127.0.0.1:8001/docs

ReDoc documentation

http://127.0.0.1:8001/redoc

🎨 Frontend Setup

Open another terminal inside the frontend folder:

cd frontend

Start the frontend:

python -m http.server 5500

Page

Address

Main application

http://127.0.0.1:5500

User login

http://127.0.0.1:5500/user-login.html

User registration

http://127.0.0.1:5500/register.html

Admin login

http://127.0.0.1:5500/admin-login.html

🔐 Create an Administrator

Run this command from the backend folder:

.\venv\Scripts\python.exe -m app.create_admin `
  --name "Administrator" `
  --email "admin@example.com" `
  --password "ChangeThis123!"

Use a strong password and never commit real administrator credentials to GitHub.

⚙️ Environment Configuration

Create a .env file inside the backend folder:

DATABASE_URL=sqlite:///./events.db
AUTH_SECRET_KEY=replace-this-with-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_ORIGINS=http://127.0.0.1:5500,http://localhost:5500

Generate a secure authentication secret:

python -c "import secrets; print(secrets.token_hex(32))"

Add the generated value to AUTH_SECRET_KEY.

Do not commit the real .env file.

🔌 API Endpoints

Events API

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

Authentication API

Method

Endpoint

Description

POST

/api/auth/register

Register a user

POST

/api/auth/user-login

Sign in as a user

POST

/api/auth/admin-login

Sign in as an administrator

GET

/api/auth/me

Retrieve the authenticated account

📊 Dataset Integration

The application can process event information from multiple datasets.

Supported fields include:

Event title and description

Category

Start and end dates

City and venue

Latitude and longitude

Organizer

Event image

Source URL

Participation information

Python utilities inside the scripts folder can inspect, clean, transform, and import event datasets.

🧠 Recommendation Approach

The current interface can recommend events using:

Search keywords

Selected category

City

Event date

Description

Saved-event preferences

Future machine-learning improvements may include:

Content-based recommendation

Event classification

Similarity scoring

User preference profiles

Collaborative filtering

Ranking models

🔒 Security

Currently Included

Password hashing

JWT authentication

User and administrator roles

Protected dashboard pages

Input validation

CORS configuration

Recommended for Production

HTTPS

Secure HttpOnly cookies

CSRF protection

Login rate limiting

Account lockout

Password-reset emails

Audit logs

Refresh-token rotation

Database migrations

Production secret management

👥 Team

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

🌿 Git Workflow

Create a feature branch:

git switch -c feature/your-feature-name

Commit the changes:

git add .
git commit -m "Add feature description"

Push the branch:

git push -u origin feature/your-feature-name

Create a pull request and merge it after review.

Avoid deleting files or force-pushing directly to the main branch.

🗺️ Roadmap

Responsive event-discovery interface

FastAPI REST backend

SQLite database integration

Interactive Leaflet map

Search and filtering

User registration and login

Administrator authentication

Role-protected dashboards

Saved-event scheduling

Production machine-learning recommendation model

Email verification and password reset

Event approval workflow

Image-upload system

Notifications and calendar integration

Advanced analytics

PostgreSQL production database

Docker and cloud deployment

📌 Project Status

Active Development

The application is functional for local development. New features, data sources, security improvements, and recommendation capabilities are being added continuously.

🤝 Contributing

Contributions should be made through feature branches and pull requests.

Before submitting a pull request:

Test your changes locally.

Confirm that existing features still work.

Use a meaningful commit message.

Describe the changes clearly in the pull request.

Request a review from another team member.

📄 License

This project is intended for academic and educational use.

A suitable open-source license should be added before public production use.

<div align="center">

Built with passion by the Local Event Finder team

⭐ Star the repository if you find the project useful.

</div>
