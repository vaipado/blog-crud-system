const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // ou onde seu front estiver
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'segredo_top', // pode inventar o que quiser
  resave: false,
  saveUninitialized: true
}));
