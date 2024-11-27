const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:4321', // Dirección del frontend
  credentials: true,
}));

// Configuración de sesiones
app.use(
  session({
    secret: 'clave_secreta', // Cambia por una clave más segura
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 horas
  })
);

// Inicializa Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas principales
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/api', apiRoutes);   // Rutas de la API

// Puerto de escucha
app.listen(5000, () => {
  console.log('Servidor escuchando en http://localhost:5000');
});
