const express = require('express');
const auth    = require('../middleware/auth');
const { list, create } = require('../controllers/commentController');

module.exports = () => {
  const r = express.Router({ mergeParams:true });
  r.get('/', list);
  r.post('/', auth, create);     // JWT requerido para escribir
  return r;
};
