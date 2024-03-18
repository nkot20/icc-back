const express = require('express');
const router = express.Router();
const companyUserRouter = require('./company.routes');

router.use('/', companyUserRouter);


module.exports = router