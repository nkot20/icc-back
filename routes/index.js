const express = require('express');
const router = express.Router();

const companyRoutes = require('./company');
const authRoutes = require('./auth.route');
const quizRoutes = require('./quiz');

router.use('/companies', companyRoutes);
router.use('/auth', authRoutes);
router.use('/quiz', quizRoutes);


module.exports = router;