# Healthcare Nearby — Study Notes & Code Walkthrough

## Project Overview
Healthcare Nearby is a full-stack web application that helps users find, navigate to, and manage healthcare facilities. It features:
- **Frontend:** React (with Vite, TypeScript, Tailwind CSS)
- **Backend:** Django REST Framework, PostgreSQL
- **Map:** Mapbox GL JS for interactive mapping and navigation

---

## Main Features
- Search and browse hospitals on an interactive map
- Get directions (with alternate routes and ETA) using Mapbox
- Hospital dashboard for profile and service management
- Secure authentication for hospitals
- Responsive, modern UI

---

## How the Code Works — Key Files & Lines

### 1. **Frontend: React (src/)**

#### `src/pages/Map.tsx`
- **Purpose:** Renders the interactive map, fetches hospitals, user location, and provides navigation.
- **Key Concepts:**
  - **User Location:**
    ```ts
    navigator.geolocation.getCurrentPosition(..., { enableHighAccuracy: true })
    ```
    Requests precise location from the browser. Used as the starting point for directions.
  - **Mapbox Map Initialization:**
    ```ts
    map.current = new mapboxgl.Map({ ... })
    ```
    Sets up the map with either a navigation-focused or detailed style, depending on user toggle.
  - **Hospital Markers:**
    ```ts
    new mapboxgl.Marker({ element: doctorSVG })
      .setLngLat([hospital.longitude, hospital.latitude])
      ...
    ```
    Places a custom SVG marker for each hospital.
  - **User Marker:**
    ```ts
    new mapboxgl.Marker({ element: userBeaconSVG })
      .setLngLat(userLocation)
      ...
    ```
    Shows the user's current (or manually set) location.
  - **Directions & Alternate Routes:**
    ```ts
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/...&alternatives=true...`)
    ```
    Fetches driving directions from Mapbox, including alternate routes. Draws them on the map and displays ETA/distance in the overlay.
  - **Map Style Toggle:**
    ```ts
    setMapStyle(mapStyle === 'navigation' ? 'streets' : 'navigation')
    ```
    Lets the user switch between a navigation-optimized map and a detailed map with more POIs.
  - **Manual Location Correction (suggested):**
    (Can be added for presentations: allow user to drag their pin if geolocation is inaccurate.)

#### `src/pages/HospitalDashboard.tsx`
- **Purpose:** Dashboard for hospitals to manage their profile and services.
- **Key Concepts:**
  - Fetches current hospital data via `/api/hospitals/me/`
  - Allows editing profile and managing offered services
  - Handles authentication (token in localStorage)

#### `src/components/HospitalCard.tsx`
- **Purpose:** Displays hospital details in both the map overlay and dashboard.
- **Key Concepts:**
  - Renders hospital name, address, phone, specialties, and services
  - Handles both string and object types for specialties/services

---

### 2. **Backend: Django (backend/)**

#### `backend/hospitals/models.py`
- **Defines Hospital and Service models**
  - Hospital: name, address, location (lat/lng), contact, etc.
  - Service: name, description, linked to Hospital

#### `backend/hospitals/serializers.py`
- **Serializes** Hospital and Service data for the API
- Handles registration, login, and profile updates

#### `backend/hospitals/views.py`
- **API endpoints** for:
  - Register/login
  - Fetching hospital details
  - Managing profile/services

#### `backend/hospitals/urls.py`
- **Maps API endpoints** to views

#### `backend/settings.py`
- **Configures:**
  - Database (PostgreSQL)
  - CORS for frontend-backend communication
  - Mapbox token (served securely via `/api/mapbox-token/`)

---

## How It All Connects
- **Frontend** fetches hospital data and Mapbox token from the **backend**.
- **User location** is determined via browser geolocation (with high accuracy).
- **Mapbox** renders the map, hospital markers, and navigation routes.
- **Hospital dashboard** allows authenticated hospitals to manage their info and services.

---

## For Your Presentation
- Walk through the main flow: user opens map → sees hospitals → gets directions → (optionally) hospital logs in to manage profile.
- Highlight how React state hooks (`useState`, `useEffect`) manage data and UI.
- Emphasize secure handling of tokens and API endpoints.
- Show how Mapbox is integrated for both navigation and detailed exploration.
- Discuss possible improvements: e.g., manual pin adjustment, real-time location updates, or analytics.

---

## Tips for Study
- Trace the data flow: from user action → React state → API call → backend response → UI update.
- Look at the code comments and function names for guidance.
- Try changing a hospital's data in the backend and see it update live on the frontend!

---

