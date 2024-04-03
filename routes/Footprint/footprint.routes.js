const Joi = require('joi');
const express = require('express');
const footprintRepository = require('../../repositories/FootprintRepository');
const validateSchema = require('../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../logger');
const authMiddleware = require('../../middlewares/authenticate.middleware'); // changed previous middleware tokenValidate with this one


router.post('/', (req, res)  => {
    try {
        
    } catch (error) {
        
    }
})