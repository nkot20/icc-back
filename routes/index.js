const express = require('express');
const router = express.Router();

const companyRoutes = require('./company');
const auth = require('./auth.route');

router.use('/companies', companyRoutes);
router.use('/auth', auth);

module.exports = router;