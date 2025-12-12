# Beauty Services Web App

A full-stack web application for booking beauty services, connecting customers with beauty services.

## Features

- User authentication (login/register)
- Browse beauty services
- View service providers and their details
- Book appointments
- Provider dashboard for managing appointments
- Customer reviews and ratings

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls

### Backend
- Node.js with Express
- PostgreSQL / SQLite database
- JWT authentication
- bcrypt for password hashing

### Deployment
- Docker & Docker Compose
- Nginx (production)

## Project Structure

```
web_app/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context (auth)
│   │   └── services/   # API service layer
│   └── Dockerfile
├── backend/            # Express backend API
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   └── config/      # Database config
│   └── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (for deployment)

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm start
```

**Backend:**
```bash
cd backend
npm install
npm run dev
```

### Production Deployment

```bash
docker compose up -d --build
```

The application will be available at `http://localhost:80`

## API Endpoints

| Route | Description |
|-------|-------------|
| `/api/auth` | Authentication (login, register) |
| `/api/services` | Beauty services CRUD |
| `/api/providers` | Service providers |
| `/api/appointments` | Appointment booking |
| `/api/reviews` | Customer reviews |

## License

MIT
