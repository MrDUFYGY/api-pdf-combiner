const express = require('express');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const router = express.Router();

// Verificar que las variables de entorno necesarias estén configuradas
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  throw new Error('Faltan variables de entorno. Asegúrate de configurar GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y GOOGLE_CALLBACK_URL en el archivo .env');
}

// Configuración de Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Aquí puedes almacenar los datos del usuario en tu base de datos
      console.log('Usuario autenticado:', profile);
      return done(null, profile);
    }
  )
);

// Serialización y deserialización del usuario
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de Google OAuth
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('https://page-pdf-utils.netlify.app/dashboard'); // Redirige al frontend en Netlify
  }
);

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión.');
    }
    res.redirect('https://page-pdf-utils.netlify.app/index'); // Redirige al inicio del frontend
  });
});

module.exports = router;
