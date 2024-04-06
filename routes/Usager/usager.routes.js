const Joi = require('joi');
const express = require('express');
const usagerRepository = require('../../repositories/UsagerRepository');
const validateSchema = require('../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../logger');
const quizRepository = require("../../repositories/QuizRepository");

router.get('/quiz/:id/:company', async (req, res) => {
    try {

        let result = await usagerRepository.getListeUsagersRepondusAuQuizz(req.params.id, req.params.company, '660ef07d12bd44b5e6ae8085');
        res.status(200).send(result);
    } catch (error) {
        logger.error('Error with getting usager list', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

module.exports = router;