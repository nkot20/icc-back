const Joi = require('joi');
const express = require('express');
const answerRepository = require('../../../repositories/AnswerRepository');
const validateSchema = require('../../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../../logger');
const authMiddleware = require('../../../middlewares/authenticate.middleware');
const calculPointRepository = require('../../../repositories/CaculPointRepository');

router.post('/', async (req, res) => {
    try {

        const response = await answerRepository.create(req.body.usager, req.body.proposition, req.body.quizId);
        console.log(response)
        return res.status(200).json({message: "Answer saved sucessfuly", response})
    } catch (error) {
        logger.error('Error when adding Answer', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})


router.get('/test', async (req, res) => {
    try {

        const response = await calculPointRepository.test();
        console.log(response)
        return res.status(200).json({message: "Answer saved sucessfuly", response})
    } catch (error) {
        logger.error('Error when adding Answer', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})
module.exports = router;
