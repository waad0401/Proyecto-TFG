const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/* ---------- middleware de validación ---------- */
const validateRegister = [
  body('nombre')
    .trim().escape()
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

  body('correo')
    .isEmail().withMessage('Correo inválido')
    .normalizeEmail(),

  body('contrasena')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
];

const validateLogin = [
  body('correo')
    .isEmail().withMessage('Correo inválido')
    .normalizeEmail(),

  body('contrasena')
    .notEmpty().withMessage('La contraseña es obligatoria')
];

/* ---------- manejador para errores de validación ---------- */
function handleValidation (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errores: errors.array() });
  }
  next();
}

/* ---------- rutas ---------- */
router.post('/register', validateRegister, handleValidation, register);
router.post('/login',    validateLogin,    handleValidation, login);

module.exports = router;
