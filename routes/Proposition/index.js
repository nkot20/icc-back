const express = require('express');
const router = express.Router();
const propositionRoutes = require('./proposition.routes');

router.use('/', propositionRoutes);


module.exports = router