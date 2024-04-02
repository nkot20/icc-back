const express = require('express');
const router = express.Router();
const quizRepository = require('./quiz.routes');

router.use('/', quizRepository);


module.exports = router