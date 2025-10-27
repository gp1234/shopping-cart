# Shopping Cart

## Architecture Overview

The application is a single Next.js app split into route groups:

- `(shop)` – customer-facing pages (e.g., `/products`, checkout).
- `(admin)` – protected admin dashboard for managing products.
- `(auth)` – login and signup flows, including referral support.

---

- `components` – shared command components

Client state is handled with **Zustand**, while MUI powers the UI. API routes under `app/api` simulate backend behavior (authentication, product CRUD) using deterministic mock data stored in `server-utils/dataStore`.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Install Playwright browsers for E2E testing
npx playwright install chromium

# 3. Run the dev server
npm run dev
```

Visit `http://localhost:3000`. You will be redirected to `/login` if not authenticated.

---

## Testing

### Unit & Component Tests (Jest)

```bash
npm run test
npm run test:watch
npm run test:coverage
```

### End-to-End Tests (Playwright)

```bash
npm run test:e2e
# or launch the UI runner
npm run test:e2e:ui
```

## ** You have to run first npx playwright install chromium so the chrominium browser playwright works**

## Test Accounts

| Role  | Email               | Password      | Redirect     |
| ----- | ------------------- | ------------- | ------------ |
| User  | `gio@example.com`   | `password123` | `/products`  |
| Admin | `admin@example.com` | `password123` | `/dashboard` |

Use the signup flow (`/signup`) for referral scenarios, e.g. `/signup?referral=1&email=friend%40mail.com`.

All seeded users can be inspected at `http://localhost:3000/api/users`.

---

## API & Data Model

- **Auth**: `POST /api/auth/login` validates credentials against `data/users.ts` and issues a mock JWT.
- **Products**: `GET /api/products` and `POST /api/products` operate on an in-memory store seeded from `public/data/products.json`.
- **Users**: `POST /api/users/new` handles signup, including referrals.

Server utilities:

- `server-utils/generateMockJWT.ts` – simple encode/decode helpers.
- `server-utils/dataStore.ts` – data container reset on server restart.

---

## Project Structure

```
├─ app/
│  ├─ (auth)/login/
│  ├─ (auth)/signup/
│  ├─ (shop)/products/
│  ├─ (admin)/dashboard/
│  └─ api/
├─ components/
│  ├─ Modal/
│  ├─ NavBar/
│  ├─ ProductFilter/
│  ├─ ProtectedRoute/
│  └─ VirtualizedTable/
├─ lib/
│  ├─ auth/
│  ├─ hooks/
│  ├─ schemas/
│  └─ store/
├─ server-utils/
├─ tests/
│  ├─ e2e/
│  └─ setupTests.ts
└─ public/data/
```
