const Joi = require('joi');
const express = require('express');
const usagerRepository = require('../../../repositories/UsagerRepository');
const validateSchema = require('../../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../../logger');
const quizRepository = require("../../../repositories/QuizRepository");
const calculPointsRepository = require('../../../repositories/CaculPointRepository');

router.get('/quiz/:id/:company', async (req, res) => {
    try {

        let result = await usagerRepository.getListeUsagersRepondusAuQuizz(req.params.id, req.params.company, '660ef07d12bd44b5e6ae8085');
        return res.status(200).send(result);
    } catch (error) {
        logger.error('Error with getting usager list', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
});

router.get('/usager/:usagerId/:companyId/:quizzId', async (req, res) => {
    try {
        let result = await usagerRepository.getUsagerDetailsRepondusAuQuizz(req.params.quizzId, req.params.usagerId, req.params.companyId, '660ef07d12bd44b5e6ae8085');
        return res.status(200).send(result);
    } catch (error) {
        logger.error('Error with getting usager list', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

router.get('/chart/:usagerId/:companyId/:quizzId', async (req, res) => {
    try {
        const maximums = await calculPointsRepository.getMaximumPointsByVariable(req.params.companyId, req.params.quizId, '660ef07d12bd44b5e6ae8085');
        const minimums = await calculPointsRepository.getMinimumPointsByVariable(req.params.companyId, req.params.quizId, '660ef07d12bd44b5e6ae8085')
        const usager = await calculPointsRepository.calculEmpreinteByVariable(req.params.usagerId, req.params.companyId, '660ef07d12bd44b5e6ae8085', req.params.quizId)
        return res.status(200).json({usager, maximums, minimums})
    } catch (error) {
        logger.error('Error with getting usager list', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

module.exports = router;