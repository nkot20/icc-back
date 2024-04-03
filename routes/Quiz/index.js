const express = require('express');
const router = express.Router();
const quizRepository = require('./quiz.routes');
const authMiddleware = require('../../middlewares/authenticate.middleware'); // changed previous middleware tokenValidate with this one


router.use('/', authMiddleware.authenticate, quizRepository);


module.exports = router