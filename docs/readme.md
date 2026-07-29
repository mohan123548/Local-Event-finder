## Local Event Finder

# Description:

Local Event Finder is an AI-powered web application that helps users discover nearby events based on their location, interests, categories, and preferences.

The platform supports cultural festivals, music concerts, technology meetups, food events, art programs, community gatherings, and regional celebrations. It provides personalized event suggestions, smart search, interactive maps, user authentication, saved schedules, and event-management tools.

The project uses a modern Vanilla JavaScript frontend with a FastAPI backend, SQLAlchemy, and SQLite.

# Key Features:

📍 Location-based event recommendations🤖 Smart and personalized event suggestions🎭 Cultural festivals, concerts, art, food, technology, and community events🔍 Smart search, category filtering, and sorting🗺️ Interactive event map using Leaflet.js📅 Event dates, locations, organizers, and participation details🔖 Save events and create a personal schedule👤 User registration and login🛡️ Separate administrator login and dashboard➕ Create and publish new events🌙 Dark and light theme support📱 Responsive design for desktop, tablet, and mobile🌍 Multi-dataset integration for diverse event coverage


## 👥 Project Team

| Role                         | Team Member               |
|------------------------------|---------------------------|
| **Product Owner & Developer**| Nai Brahmana Mohan Kumar  |
| **Scrum Master & Developer** | Deeksith Shankar          |
| **Developer**                | Samba Shiva Rao           |
| **Developer**                | Ahmad Alisha              |
| **Developer**                | Mothadi Venkata Sai Raghu |



# Project Overview

Local Event Finder is a dynamic event-discovery web application designed to help users find, explore, save, and organize local and international events.

The application includes a curated discovery feed, an interactive map finder, event-organization tools, user and administrator authentication, saved schedules, and a smart local event assistant.

The project combines a modern and responsive user interface with a FastAPI REST backend for storing, retrieving, and managing event information.

# Architecture

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


# Tech Stack


1.HTML5: Provides the semantic structure of the application.

2.CSS3 (Vanilla): Used for responsive layouts, animations, glassmorphism components, Aurora-style colors, and dark/light theme support.

3.JavaScript (Vanilla JS): Handles search, filtering, sorting, event rendering, authentication, API requests, saved schedules, modals, and interface interactions.

4.FastAPI: Provides the backend REST API for events, user registration, user login, administrator login, and protected account information.

5.SQLAlchemy: Manages database models, queries, and communication between FastAPI and SQLite.

6.SQLite: Stores event and user information during local development.

7.Pydantic: Validates API requests and responses.

8.Leaflet.js: Renders the interactive map and displays event location markers.

9.OpenStreetMap: Provides map tiles for the Leaflet map.

10.JWT Authentication: Protects user and administrator sessions.

11.Argon2 Password Hashing: Securely hashes user and administrator passwords.

12.Python: Used for backend development, dataset preparation, inspection, cleaning, and importing event records.


# Main Modules

1.Discover Feed: Displays featured and recommended events.

2.Map Finder: Shows events on an interactive map using latitude and longitude.

3.My Schedule: Stores the events saved by the user.

4.Organize Event: Allows new event information to be submitted to the backend.

5.City Assistant: Suggests events using categories, locations, and search terms.

6.User Portal: Provides registration, login, and protected user access.

7.Admin Portal: Provides role-protected administrator access and management-ready pages.


# Getting Started:

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

# Create an Administrator Account

# 👨‍💼 Create Administrator Account

After setting up the backend and database, create the initial administrator account by running the following command from the **backend** directory:

```powershell
.\venv\Scripts\python.exe -m app.create_admin `
  --name "Administrator" `
  --email "admin@example.com" `
  --password "ChangeThis123!"

# 🔗 API Documentation

The Local Event Finder backend provides a RESTful API developed using FastAPI. The API is organized into two main categories:

Event Management APIs
Authentication APIs

# 📅 Event Endpoints

These endpoints allow users and administrators to retrieve and manage event information.

| Method     | Endpoint                 | Description                                                             |
| ---------- | ------------------------ | ----------------------------------------------------------------------- |
| **GET**    | `/api/events`            | Retrieve all available events from the database.                        |
| **POST**   | `/api/events`            | Create and store a new event.                                           |
| **GET**    | `/api/events/{event_id}` | Retrieve detailed information for a specific event using its unique ID. |
| **PUT**    | `/api/events/{event_id}` | Update the details of an existing event.                                |
| **DELETE** | `/api/events/{event_id}` | Permanently remove an event from the database.                          |


# 🔐 Authentication Endpoints

These endpoints manage user registration, authentication, and authorization.

| Method   | Endpoint                | Description                                                                   |
| -------- | ----------------------- | ----------------------------------------------------------------------------- |
| **POST** | `/api/auth/register`    | Register a new user account.                                                  |
| **POST** | `/api/auth/user-login`  | Authenticate and sign in as a registered user.                                |
| **POST** | `/api/auth/admin-login` | Authenticate and sign in as an administrator.                                 |
| **GET**  | `/api/auth/me`          | Retrieve information about the currently authenticated user or administrator. |


# 🔄 API Workflow

The typical application workflow is as follows:

User Registration
        │
        ▼
User Login
        │
        ▼
JWT Token Generated
        │
        ▼
Authenticated Requests
        │
        ▼
Search & Browse Events
        │
        ▼
Save Favourite Events
        │
        ▼
Create / Update Events (Admin)



# Repository Structure

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

# Dataset Integration:

The application can use multiple event datasets containing:

# 📋 Event Dataset Structure

The Local Event Finder application stores event information in a structured format to ensure accurate searching, filtering, and recommendation of local events.

| Field | Description |
|-------|-------------|
| **Event Title** | The official name of the event displayed to users. |
| **Event Description** | A detailed overview of the event, including its purpose, activities, and highlights. |
| **Category** | The type of event (e.g., Music, Sports, Festival, Technology, Business, Cultural, Community). |
| **Start Date & Time** | The scheduled starting date and time of the event. |
| **End Date & Time** | The scheduled ending date and time of the event. |
| **City** | The city where the event is taking place. |
| **Venue** | The exact location or venue where the event will be hosted. |
| **Latitude & Longitude** | Geographic coordinates used for map visualization and location-based recommendations. |
| **Organizer** | The organization or individual responsible for hosting the event. |
| **Event Image** | A representative image or banner displayed for the event. |
| **Source URL** | The original website or source from which the event information was collected. |
| **Participation Guidelines** | Instructions, eligibility requirements, ticket information, dress code, or rules for attendees. |

---

# 🛠️ Data Processing Scripts

The project contains a dedicated **`scripts/`** folder that includes Python utilities for preparing and managing event datasets.

These scripts can be used to:

- Inspect raw event datasets
- Clean duplicate or incomplete records
- Standardize event information
- Transform datasets into a consistent format
- Import processed data into the application's database
- Validate data quality before deployment

This automated preprocessing pipeline ensures that the application always works with accurate and structured event information.

---

# 🤖 Smart Recommendation System

The Local Event Finder includes an intelligent recommendation system that suggests relevant events based on user preferences.

## Current Recommendation Features

The application currently recommends events using:

- 🔍 Search keywords entered by the user
- 📂 Selected event categories
- 📍 User's current location
- 🏙️ Event city
- 📅 Event date
- 📝 Event description
- ❤️ Previously saved or bookmarked events

These recommendation techniques help users quickly discover events that match their interests.

---

## Future AI Recommendation Enhancements

To improve personalization, the recommendation engine can be extended using Artificial Intelligence and Machine Learning techniques such as:

### Content-Based Recommendation
Recommends events with similar characteristics based on event descriptions, categories, locations, and user interests.

### Event Classification
Automatically classifies events into predefined categories using Natural Language Processing (NLP).

### Similarity Scoring
Calculates similarity between events using text embeddings and feature matching to recommend closely related events.

### User Preference Profiles
Builds personalized user profiles based on browsing history, saved events, attendance history, and search behavior.

### Collaborative Filtering
Suggests events by identifying users with similar interests and recommending events they have attended or saved.

### Machine Learning Ranking Models
Uses machine learning algorithms to rank events according to relevance, popularity, user preferences, location, and historical interactions.

---

# 🔒 Security Features

The application follows modern web security practices to protect user accounts and sensitive information.

## Current Security Implementation

The project currently includes:

- 🔐 Password Hashing for secure password storage
- 🎫 JWT (JSON Web Token) Authentication
- 👤 Role-Based Access Control (User & Administrator)
- 🛡️ Protected Dashboard Pages
- ✅ Input Validation to prevent invalid or malicious input
- 🌐 CORS (Cross-Origin Resource Sharing) Configuration

---

## Recommended Security Enhancements for Production

Before deploying the application in a production environment, the following security measures should be implemented:

### HTTPS Encryption
Encrypts all communication between users and the server.

### Secure HttpOnly Cookies
Protects authentication tokens from client-side JavaScript attacks.

### CSRF Protection
Prevents unauthorized cross-site request forgery attacks.

### Login Rate Limiting
Limits repeated login attempts to reduce brute-force attacks.

### Account Lockout
Temporarily locks accounts after multiple failed login attempts.

### Password Reset Workflow
Provides secure password recovery through verified email links.

### Audit Logs
Maintains records of user activities for monitoring and security analysis.

### Refresh Token Rotation
Improves session security by periodically renewing authentication tokens.

### Production Database Configuration
Implements secure database credentials, backups, encryption, monitoring, and restricted access for production environments.

---

# 🌿 Git Workflow

To ensure smooth collaboration and maintain code quality, the team follows a structured Git workflow.

## Branching Strategy

Each team member works on a dedicated feature branch instead of directly modifying the main branch.

### Workflow

1. Create a new branch for your assigned feature.
2. Develop and test your changes locally.
3. Commit changes with meaningful commit messages.
4. Push the branch to the remote repository.
5. Create a Pull Request (PR).
6. Conduct code review and resolve feedback.
7. Merge the approved branch into the main branch.

### Benefits

- Prevents merge conflicts
- Enables parallel development
- Simplifies code reviews
- Maintains project stability
- Provides version history and rollback capability
- Encourages collaborative software development following Agile practices

# 🚀 Future Improvements

The Local Event Finder project is designed to be scalable and continuously enhanced with advanced features. Planned future improvements include:

| Feature | Description |
|---------|-------------|
| **AI-Powered Recommendation Engine** | Implement machine learning algorithms to provide highly personalized event recommendations based on user interests and behavior. |
| **User Preference Questionnaire** | Allow users to select their interests during registration to improve recommendation accuracy. |
| **Email Verification** | Verify user email addresses during account registration to improve security and prevent fake accounts. |
| **Password Reset System** | Enable secure password recovery through email-based reset links. |
| **Google Authentication** | Allow users to register and log in using their Google accounts through OAuth authentication. |
| **Event Approval Workflow** | Introduce an administrator approval process before newly created events become publicly visible. |
| **Event Image Upload** | Allow organizers to upload custom event images instead of using predefined images. |
| **Notification System** | Send notifications for upcoming events, reminders, new recommendations, and event updates. |
| **Calendar Integration** | Allow users to add events directly to Google Calendar, Outlook, or Apple Calendar. |
| **Advanced Analytics Dashboard** | Provide administrators with detailed insights into user activity, event popularity, registrations, and platform usage. |
| **PostgreSQL Production Database** | Replace SQLite with PostgreSQL for improved scalability, reliability, and production deployment. |
| **Docker Deployment** | Containerize both frontend and backend services for consistent development and deployment environments. |
| **Cloud Hosting** | Deploy the application to cloud platforms such as AWS, Microsoft Azure, or Google Cloud Platform for high availability and scalability. |

---

# 📚 Documentation

The project follows a modular architecture to improve readability, maintainability, and scalability. Each component has a dedicated responsibility within the application.

## Frontend Modules

### 📄 `frontend/app.js`
Responsible for the core functionality of the user interface, including:

- Loading event data
- Event searching and filtering
- Sorting events
- Interactive map integration
- Saved schedules and bookmarks
- Modal windows
- Event creation interface
- User interaction logic

---

### 🔐 `frontend/auth.js`

Handles user authentication features, including:

- User registration
- User login
- Administrator login
- Authentication validation
- JWT token storage

---

### 🛡️ `frontend/dashboard.js`

Manages protected dashboard functionality by:

- Verifying JWT authentication tokens
- Restricting unauthorized access
- Displaying user dashboard
- Displaying administrator dashboard
- Managing authenticated sessions

---

## Backend Modules

### ⚙️ `backend/app/routers/events.py`

Implements all event-related API endpoints, including:

- Retrieve events
- Create new events
- Update existing events
- Delete events
- Search and filter events
- Event management services

---

### 🔑 `backend/app/routers/auth.py`

Provides authentication services, including:

- User registration
- User login
- Administrator authentication
- JWT token generation
- Authenticated user endpoints
- Session validation

---

## Data Processing

### 🐍 `scripts/`

Contains Python utilities used for data preparation and maintenance.

These scripts are responsible for:

- Inspecting raw event datasets
- Cleaning incomplete or duplicate records
- Transforming datasets into a standardized format
- Importing processed event data
- Validating data quality
- Preparing datasets for machine learning models

---

# 📌 Project Status

## Current Development Status

**Local Event Finder** is currently under **active development** and continues to evolve with new features and improvements.

### ✅ Current Features

The current version includes:

- 🌍 Interactive event discovery interface
- ⚡ FastAPI backend architecture
- 🗄️ SQLite database integration
- 🗺️ Interactive map visualization
- 👤 User registration
- 🔐 Secure user login
- 👨‍💼 Administrator authentication
- ❤️ Saved events and personal schedules
- 🔍 Event search functionality
- 🎯 Category-based filtering
- ➕ Event creation system
- 📱 Responsive user interface
- 🔒 JWT-based authentication
- 🛡️ Role-based access control

---

## 🔮 Roadmap

### Phase 1 (Completed)

- Event browsing
- User authentication
- Interactive maps
- Event management
- Basic recommendation system

### Phase 2 (In Progress)

- Improved event recommendations
- User personalization
- Better dashboard analytics
- Enhanced administrator tools

### Phase 3 (Planned)

- AI-powered recommendation engine
- Cloud deployment
- Docker containerization
- PostgreSQL migration
- Real-time notifications
- Calendar integration
- Mobile application support

---

# 🎯 Project Vision

Our vision is to build an intelligent, AI-powered event discovery platform that enables users to effortlessly find personalized local events while providing organizers with powerful tools to manage, promote, and analyze their events.

By combining **Artificial Intelligence, geolocation services, recommendation systems, and modern web technologies**, Local Event Finder aims to become a scalable, user-centric platform for discovering and managing events across different cities and communities.
