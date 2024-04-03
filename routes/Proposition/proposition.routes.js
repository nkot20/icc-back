const Joi = require('joi');
const express = require('express');
const validateSchema = require('../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../logger');
const authMiddleware = require('../../middlewares/authenticate.middleware');
const propositionRepository = require('../../repositories/PropositionRepository')
const questionCreateSchema = Joi.object({
    label: Joi.string().required(),
});

//create question proposition
router.post('/question/add/:id', validateSchema(questionCreateSchema), async (req, res) => {
    try {
        let datas = {
            label: req.body.label,
            questionId: req.params.id
        }
        let proposition = await propositionRepository.create(datas);
        return res.status(200).json({message: "proposition saved sucessfuly", proposition})
    } catch (error) {
        logger.error('Error when creating proposition', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

router.get('/all', async (req, res) => {
    try {
        let propositions = await propositionRepository.getPropositionsGroupedByHierarchy();
        return res.status(200).json({message: "All proposition", propositions})
    } catch (error) {
        logger.error('Error when getting proposition', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

module.exports = router;