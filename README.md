# 🎬 CineTrack

A full-stack movie tracking web app inspired by AniWatch/Letterboxd, built with Django and React.

## 🌐 Live Demo
- Frontend: (coming soon)
- Backend API: (coming soon)

## ✨ Features
- 🔍 Search any movie via OMDB API
- 🔐 JWT Authentication (register/login/logout)
- 📋 Personal watchlist with 4 status categories:
  - ▶ Watching
  - ✅ Completed
  - 📋 Planning to Watch
  - 🛑 Stopped
- 📝 Add personal notes to each movie
- 📥 Download your watchlist as TXT or JSON
- 🎨 AniWatch-inspired dark UI with purple accents

## 🛠 Tech Stack

### Backend
- Python / Django
- Django REST Framework
- JWT Authentication (SimpleJWT)
- OMDB API integration
- SQLite (dev) / PostgreSQL (prod)

### Frontend
- React + Vite
- Tailwind CSS
- Axios + React Router v6
- Context API for global auth state

## 🚀 Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your OMDB key to .env
python manage.py migrate
python manage.py runserver


Frontend

cd frontend
npm install
npm run dev -- --host

Project Structure
CineTrack/
├── backend/          # Django REST API
│   ├── cinetrack/    # Project config
│   ├── users/        # Auth endpoints
│   ├── movies/       # OMDB integration
│   └── watchlist/    # Watchlist CRUD
└── frontend/         # React + Vite
    └── src/
        ├── api/      # Axios config
        ├── components/
        ├── context/  # Auth context
        └── pages/


Environment Variables
Backend (.env)

OMDB_API_KEY=your_key_here
SECRET_KEY=your_django_secret
DEBUG=True

Author
Built by Travelling-Human
