# Fathima Hashim Portfolio — MongoDB + Express + EJS

The portfolio pages are server-rendered with EJS. Profile, education, skills, interests, internship, projects, contact details and footer content are loaded from the `Portfolio` collection in MongoDB. Contact form submissions are saved in `ContactMessage`.

## Requirements
- Node.js 18 or newer
- MongoDB local instance or MongoDB Atlas database

## Setup
1. Extract this folder and open a terminal inside it.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection string. For local MongoDB, the example value works if MongoDB is running locally.
4. Insert the original portfolio content into MongoDB:
   ```bash
   npm run seed
   ```
   The seed command uses an upsert on `key: "main"`, so it can be run again to restore/update the starter content. It overwrites the main portfolio document with the seed data.
5. Start the site:
   ```bash
   npm start
   ```
6. Visit `http://localhost:3000`.

For development with Node's watch mode, run `npm run dev`.

## Database schema
- `Portfolio` (`models/Portfolio.js`): one document with `key: "main"`; nested profile/contact fields and arrays for education, skill groups, interests, internship and projects.
- `ContactMessage` (`models/ContactMessage.js`): validated name, email, optional subject, message and creation timestamp.

## Routes
- `GET /` — database-backed home page
- `GET /about` — database-backed about, education, skills, interests, internship and projects
- `GET /contact` — database-backed contact details and contact form
- `POST /contact` — validates and stores a contact message in MongoDB
- `GET /api/portfolio` — read-only JSON representation of the portfolio document

## Updating portfolio content
Edit the `main` document in the MongoDB `portfolios` collection using MongoDB Compass or your preferred MongoDB client. The pages read from MongoDB on each request, so updates appear on the next page load without editing EJS templates. The seed script is only starter data, not an admin panel.

## Notes
- The source HTML had a malformed email (`fathimahashim005@gmail,cpom`). The seed data uses the likely corrected address `fathimahashim005@gmail.com`; verify it before publishing.
- No database credentials are included. Keep your real `.env` file private and never commit it.
