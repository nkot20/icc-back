const Joi = require('joi');
const express = require('express');
const footprintRepository = require('../../../repositories/FootprintRepository');
const variableRepository = require('../../../repositories/VariableRepository');
const validateSchema = require('../../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../../logger');
const authMiddleware = require('../../../middlewares/authenticate.middleware');
const questionRepository = require('../../../repositories/QuestionRepository')
const questionCreateSchema = Joi.object({
    label: Joi.string().required(),
    type: Joi.string().required(),
    weighting: Joi.boolean().required(),
    factorId: Joi.string().required()
});

router.post('/add/factor', async (req, res) => {
    try {
        const datas = req.body;
        const promise = datas.map(async (value) => {
            return await questionRepository.create(value);
        });
        const response = await Promise.all(promise);

        return res.status(200).json({message: "question saved sucessfuly", response})
    } catch (error) {
        logger.error('Error when creating question', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

module.exports = router;