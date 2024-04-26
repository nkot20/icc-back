const express = require('express');
const router = express.Router();

const eLearningRoutes = require('./e-learning');
const backOfficeRoutes = require('./back-office');

router.use('/e-learning', eLearningRoutes);
router.use('/back-office', backOfficeRoutes);


module.exports = router;