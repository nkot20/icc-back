const express = require('express');
const router = express.Router();
const factorRouter = require('./factor.routes');

router.use('/', factorRouter);


module.exports = router