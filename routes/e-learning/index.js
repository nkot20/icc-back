const express = require('express');
const router = express.Router();

const companyRoutes = require('./Company');
const authRoutes = require('./auth.route');
const quizRoutes = require('./Quiz');
const footprintRoutes = require('./Footprint');
const questionRoutes = require('./Questions');
const propositionQuestionRoutes = require('./Proposition');
const answerRoutes = require('./Answer')
const usagerRoutes = require('./Usager');


router.use('/companies', companyRoutes);
router.use('/auth', authRoutes);
router.use('/Quiz', quizRoutes);
router.use('/footprint', footprintRoutes);
router.use('/question', questionRoutes);
router.use('/proposition', propositionQuestionRoutes);
router.use('/answer', answerRoutes);
router.use('/usager', usagerRoutes);






module.exports = router;