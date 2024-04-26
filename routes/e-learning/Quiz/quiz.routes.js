const Joi = require('joi');
const express = require('express');
const quizRepository = require('../../../repositories/QuizRepository');
const validateSchema = require('../../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../../logger');

const QuizzCreateSchema = Joi.object({
    companyId: Joi.string().required(),
    title: Joi.string().required(),
    minMean: Joi.number().required(),
    description: Joi.string().required(),
});


router.post('/', validateSchema(QuizzCreateSchema), async (req, res) => {
    try {

        let result = await quizRepository.create(req.body);
        res.status(200).send(result);
    } catch (error) {
        logger.error('Error with creating Quiz', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

router.get('/:id', async (req, res) => {
    try {
        let result = await quizRepository.findByCompany(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        logger.error('Error with getting Quiz', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

router.patch('/:id', async (req, res) => {
    try {
        let result = await quizRepository.update(req.params.id, req.body);
        res.status(200).send(result);
    } catch (error) {
        logger.error('Error with updating Quiz', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})


module.exports = router;