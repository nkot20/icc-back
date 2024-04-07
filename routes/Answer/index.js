const express = require('express');
const router = express.Router();
const answerRoute = require('./answer.route');

router.use('/', answerRoute);


module.exports = router