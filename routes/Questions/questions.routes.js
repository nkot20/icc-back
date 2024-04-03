const Joi = require('joi');
const express = require('express');
const footprintRepository = require('../../repositories/FootprintRepository');
const variableRepository = require('../../repositories/VariableRepository');
const validateSchema = require('../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../logger');
const authMiddleware = require('../../middlewares/authenticate.middleware');
const questionRepository = require('../../repositories/QuestionRepository')
const questionCreateSchema = Joi.object({
    label: Joi.string().required(),
    isForWeight: Joi.boolean()
});

router.post('/add/factor/:id',  validateSchema(questionCreateSchema), async (req, res) => {
    try {
        let datas = {
            label: req.body.label,
            isForWeight: req.body.isForWeight,
            factorId: req.params.id
        }
        let question = await questionRepository.create(datas);
        return res.status(200).json({message: "question saved sucessfuly", question})
    } catch (error) {
        logger.error('Error when creating question', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

module.exports = router;