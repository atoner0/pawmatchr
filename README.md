# Pawmatchr

Pawmatchr is a dog adoption matching platform that pairs prospective adopters with rescue dogs using a hybrid fuzzy logic and semantic similarity matching algorithm. The system is built as three components:

- **`backend`** - Node.js/Express/TypeScript REST API, owns the PostgreSQL database and orchestrates the matching flow. Also produces the server-rendered shelter admin web app.
- **`matching-service`** - Python/FastAPI microservice running the fuzzy logic + semantic scoring algorithm
- **`mobile`** - React Native/Expo adopter-facing app

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) for running the mobile app locally
- [Expo Go](https://expo.dev/go) app (for physical device) and/or [Android Studio](https://developer.android.com/studio) (for emulator)
- An OpenAI API key

## Project Structure
```
pawmatchr/
|--- backend/ # Node.js/Express/TypeScript API + EJS
|--- matching-service/ # Python/FastAPI matching microservice
|--- mobile/ # React Native/Expo adopter app
|--- docker-compose.yml
|--- README.md
```

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/atoner0/pawmatchr
cd pawmatchr
```

### 2. Configure environment variables

Copy the provided `.env.example` files where present and fill in the required values (`OPENAI_API_KEY`, `JWT_SECRET`, `SESSION_SECRET`), or create the `.env` files manually as below.

Create a `.env` file inside **`backend/`**:

```dotenv
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@db:5432/pawmatchr
JWT_SECRET=
MATCHING_SERVICE_URL=http://matching-service:5001
NODE_ENV=development
SESSION_SECRET=
```

Create a `.env` file inside **`matching-service/`**:

```dotenv
OPENAI_API_KEY=
DEBUG=true
SEMANTIC_MODEL_NAME=all-MiniLM-L6-v2
FUZZY_WEIGHT=0.7
SEMANTIC_WEIGHT=0.3
PORT=5001
```

All fields except `OPENAI_API_KEY` have defaults set in `config.py`, so only `OPENAI_API_KEY` is strictly reqruired, the rest are shown here for visibility/override. Note `FUZZY_WEIGHT` and `SEMANTIC_WEIGHT` must sum to 1, enforced on startup.

### 3. Start the backend, matching service, and database via Docker Compose

From the project root:

```bash
docker compose up --build
```

This starts three containers:
| Service | Container | Port
| --- | --- | --- |
| PostgreSQL 17 | `pawmatchr_db` | `5432` |
| Matching service (FastAPI) | `pawmatchr_matching_service` | `5001` |
| Backend (Express) | `pawmatchr_backend` | `3000` |

The database is initialised from any SQL files in `backend/src/db` on first run (via the Postgres image's `docker-entrypoint-initdb.d` mechanism)

### 4. Seed data (optional)

With the containers running:

```bash
docker compose exec backend npm run seed
```

### 5. Start the mobile app

The mobile app is not containerised and runs separately from the `mobile/` folder:

```bash
cd mobile
npm install
npm run start
```

This opens the Expo developer tools. From there:

- Press `a` to open in an Android emulator (requires Android Studio configured), or
- Scan the QR code with the Expo Go app on a physical device

The mobile app expects the backend API to be reachable - if testing on a physical device or emulator, ensure `MATCHING_SERVICE_URL`/API base URL configuration points to your machine's local network IP rather than `localhost`, since the emulator/device does not share the host's network namespace.

### Access
| App | URL |
| --- | --- |
| Backend API | `http://localhost:3000` |
| Matching service | `http://localhost:5001` |
| Admin web app | `http://localhost:3000/admin` |
| Mobile app | via Expo Go / emulator

## Running Tests

Tests are run inside the running containers, rather than on the host, since dependencies are installed onto the container image only (`backend/node_modules` is excluded from the host bind mount). Ensure the containers are running first (`docker compose up`) before running any of the commands below.

### Backend

Integration tests run against a separate `pawmatchr_test` database rather than the `pawmatchr` database. The connections string is set directly in `tests/jest.setup.ts` and overrides whatver `DATABASE_URL` is set in `backend/.env`. Both `pawmatchr` and `pawmatchr_test` are created and schema'd automatically on first start up via the init scripts in `backend/src/db` (mounted into Postgres' `docker-entrypoint-initdb.d`), so no manual setup is required

```bash
docker compose exec backend npm test                    # unit tests (Jest)
docker compose exec backend npm run test:integration    # integration tests (Jest + Supertest, requires test DB)
```

### Matching service

```bash
docker compose exec matching-service pytest
```

## Tech stack
| Component | Stack |
| --- | --- |
| Mobile app | React Native, Expo, TypeScript, React Hook Form + Zod |
| Backend | Node.js, Express, TypeScript, Zod, node-pg-migrate |
| Matching service | Python, FastAPI, NumPy, sentence-transformers (`all-MiniLM-L6-v2`), OpenAI (`gpt-4.1-mini`) |
| Admin web app | EJS, express-ejs-layouts, Bootstrap 5 |
| Database | PostgreSQL 17

## Notes

- `docker compose up` mounts `backend/` and `matching-service/` as volumes, so code changes are reflected without rebuilding the image. The backend runs via `npm run dev` and picks up changes automatically. The mathcing service's hot reload is controlled by the `DEBUG` setting (`reload=settings.debug` in `app.py`), ensure `DEBUG=true` in `matching-service/.env` for changes to be picked up automatically
- `node_modules` inside the backend container is exlcuded from the host mount to avoid platform-specific binary conflicts between host and container. This is also why backend commands are run via `docker compose exec` rather than directly on the host

