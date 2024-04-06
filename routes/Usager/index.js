const express = require('express');
const router = express.Router();
const usagerRoutes = require('./usager.routes');
const authMiddleware = require('../../middlewares/authenticate.middleware'); // changed previous middleware tokenValidate with this one


router.use('/', usagerRoutes);


module.exports = router