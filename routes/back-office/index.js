const express = require('express');
const router = express.Router();
const imprintRouter = require('./Imprints');
const variableRouter = require('./Variables');
const authRouter = require('./auth.route');
router.use('/imprints', imprintRouter);
router.use('/variable', variableRouter);
router.use('/auth', authRouter);



module.exports = router