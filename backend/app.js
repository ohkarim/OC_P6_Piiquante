const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');

const path = require('path');

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Parse JSON bodies, mandatory to handle data from request body
// `app.use(express.json())` **before** your route handlers!
app.use(express.json());

app.use(cors());


app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

// Static path for image uploads
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;