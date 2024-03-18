const express = require('express');
const router = express.Router();

const companyRoutes = require('./company');

router.use('/companies', companyRoutes)

module.exports = router;