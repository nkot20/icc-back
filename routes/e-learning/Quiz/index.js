const express = require('express');
const router = express.Router();
const quizRoutes = require('./quiz.routes');
const authMiddleware = require('../../../middlewares/authenticate.middleware'); // changed previous middleware tokenValidate with this one


router.use('/', authMiddleware.authenticate, quizRoutes);


module.exports = router