# URL Shortener

A full-stack URL shortener built with Node.js, Express, and MySQL. Converts long URLs into short codes using base62 encoding of the database auto-increment id, and tracks click counts per link.

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MySQL (via `mysql2`)
- **Frontend:** Vanilla HTML/CSS/JS

## Project Structure
```
url-shortener/
├── config/
│   └── db.js              # MySQL connection pool
├── controllers/
│   └── urlController.js   # Business logic: shorten, redirect, stats
├── routes/
│   └── urlRoutes.js       # Express route definitions
├── utils/
│   └── base62.js          # Base62 encoding helper
├── public/                # Frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js               # App entry point
├── .env
└── package.json
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
Open MySQL Workbench, connect to your local MySQL instance, and run the contents of `sql/schema.sql`. This creates the `url_shortener` database and `urls` table.

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your MySQL credentials:
```bash
cp .env.example .env
```
```
PORT=3000
BASE_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=url_shortener
DB_PORT=3306
```

### 4. Run the server
```bash
npm start
```
Or, for auto-restart on file changes during development:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## API Endpoints

| Method | Endpoint              | Description                          |
|--------|------------------------|---------------------------------------|
| POST   | `/api/shorten`         | Body: `{ "longUrl": "..." }` → returns short URL |
| GET    | `/:shortCode`           | Redirects to the original long URL   |
| GET    | `/api/stats/:shortCode` | Returns click count and metadata     |

## How it works
1. A new row is inserted into the `urls` table with just the long URL.
2. MySQL's auto-increment `id` for that row is encoded into a short base62 string (e.g., id `125` → `"cb"`).
3. The short code is saved back onto the row.
4. Visiting `/<shortCode>` looks up the row, increments the click counter, and issues a 302 redirect to the original URL.

## Possible next steps
- Add Redis caching in front of the short-code lookup
- Add rate limiting on `/api/shorten`
- Support custom aliases (user-provided short codes)
- Deploy backend to Render/Railway and add a proper domain
