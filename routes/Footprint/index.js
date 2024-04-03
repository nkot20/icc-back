const express = require('express');
const router = express.Router();
const footprintRouter = require('./footprint.routes');
const factorRouter = require('../Factor');

router.use('/', footprintRouter);
router.use('/Factor', factorRouter);



module.exports = router