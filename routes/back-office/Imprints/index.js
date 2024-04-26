const express = require('express');
const router = express.Router();
const footprintRouter = require('./imprint.routes');

router.use('/', footprintRouter);



module.exports = router