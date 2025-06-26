# Healthcare Nearby

A modern web application for discovering and managing healthcare facilities, featuring a React/Vite frontend and a Django/PostgreSQL backend.

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Python** (3.10+ recommended)
- **pip** (Python package manager)
- **PostgreSQL** (14+ recommended)

---

## Backend Setup (Django)

1. **Navigate to the backend directory:**
   ```sh
   cd backend
   ```
2. **Create a virtual environment:**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
4. **Configure environment variables:**
   - Copy `.env.example` to `.env` (if present), or set the following in your environment:
     - `DATABASE_URL` (or configure `settings.py` for your Postgres DB)
     - `MAPBOX_ACCESS_TOKEN` (your Mapbox public token)
5. **Apply migrations:**
   ```sh
   python manage.py migrate
   ```
6. **Create a superuser (optional, for admin access):**
   ```sh
   python manage.py createsuperuser
   ```
7. **Run the backend server:**
   ```sh
   python manage.py runserver
   ```

---

## Frontend Setup (React/Vite)

1. **Navigate to the project root:**
   ```sh
   cd .. # if in backend/
   ```
2. **Install frontend dependencies:**
   ```sh
   npm install
   ```
3. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```
   - The app will be available at [http://localhost:5173](http://localhost:5173)

---

## Notes
- The frontend proxies API requests to the Django backend (see `vite.config.js` for proxy settings).
- Ensure PostgreSQL is running and accessible.
- For production, configure secure environment variables and use a production-ready server setup.

---

## Project Structure
- `src/` — React frontend code
- `backend/` — Django backend code
- `public/` — Static assets

---

## Troubleshooting
- If you encounter issues, check that all prerequisites are installed and environment variables are set correctly.
- For further help, consult the official docs for [Django](https://docs.djangoproject.com/), [React](https://react.dev/), and [Vite](https://vitejs.dev/).

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

