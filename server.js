require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Portfolio = require('./models/Portfolio');
const ContactMessage = require('./models/ContactMessage');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.json({ limit: '20kb' }));

// All page content is loaded from the singleton Portfolio document in MongoDB.
async function loadPortfolio(req, res, next) {
  try {
    const portfolio = await Portfolio.findOne({ key: 'main' }).lean();
    if (!portfolio) {
      return res.status(503).render('error', {
        title: 'Portfolio not configured',
        message: 'Portfolio content has not been added to the database yet. Run npm run seed.'
      });
    }
    res.locals.portfolio = portfolio;
    next();
  } catch (error) { next(error); }
}

app.get('/', loadPortfolio, (req, res) => res.render('index', { title: 'Home' }));
app.get('/about', loadPortfolio, (req, res) => res.render('about', { title: 'About' }));
app.get('/contact', loadPortfolio, (req, res) => res.render('contact', { title: 'Contact', success: req.query.sent === '1', error: null }));

app.post('/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (![name, email, message].every(value => typeof value === 'string' && value.trim())) {
      const portfolio = await Portfolio.findOne({ key: 'main' }).lean();
      if (!portfolio) return res.status(503).send('Portfolio is not configured.');
      return res.status(400).render('contact', { title: 'Contact', portfolio, success: false, error: 'Please provide your name, a valid email address, and a message.' });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      const portfolio = await Portfolio.findOne({ key: 'main' }).lean();
      return res.status(400).render('contact', { title: 'Contact', portfolio, success: false, error: 'Please enter a valid email address.' });
    }
    await ContactMessage.create({ name, email, subject, message });
    res.redirect('/contact?sent=1');
  } catch (error) { next(error); }
});

// Read-only JSON endpoint for integrations or a future admin interface.
app.get('/api/portfolio', async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ key: 'main' }).lean();
    if (!portfolio) return res.status(404).json({ error: 'Portfolio content not found. Run npm run seed.' });
    res.json(portfolio);
  } catch (error) { next(error); }
});

app.use((req, res) => res.status(404).render('error', { title: 'Page not found', message: 'The page you requested could not be found.' }));
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('error', { title: 'Something went wrong', message: 'Please try again later.' });
});

async function start() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing. Copy .env.example to .env and configure it.');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));
}

start().catch(error => { console.error('Unable to start server:', error.message); process.exit(1); });
