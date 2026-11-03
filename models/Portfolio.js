const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  institution: { type: String, default: '' },
  technology: { type: String, default: '' },
  url: { type: String, default: '' }
}, { _id: true });

const skillGroupSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  items: [{ title: { type: String, required: true }, description: { type: String, default: '' } }]
}, { _id: false });

const portfolioSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'main', immutable: true },
  profile: {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    welcome: { type: String, default: 'WELCOME TO MY PORTFOLIO' },
    intro: { type: String, default: '' },
    about: [String]
  },
  education: [itemSchema],
  skillGroups: [skillGroupSchema],
  interests: [itemSchema],
  internship: [itemSchema],
  projects: [itemSchema],
  contact: {
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    intro: { type: String, default: '' }
  },
  footerText: { type: String, default: 'All Rights Reserved.' }
}, { timestamps: true, minimize: false });

module.exports = mongoose.model('Portfolio', portfolioSchema);
