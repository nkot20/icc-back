const Joi = require('joi');
const express = require('express');
const footprintRepository = require('../../repositories/FootprintRepository');
const variableRepository = require('../../repositories/VariableRepository');
const factorRepository = require('../../repositories/FactorRepository');
const validateSchema = require('../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../logger');
const authMiddleware = require('../../middlewares/authenticate.middleware');
const factorCreateSchema = Joi.object({
    name: Joi.string().required(),
});

router.patch('/variable/add/:id', validateSchema(factorCreateSchema), async (req, res) => {
    try {
        let datas = {
            name: req.body.name,
            variableId: req.params.id
        }
        const factor = await factorRepository.create(datas);
        //const variable = await variableRepository.addFactorToVariable(req.params.id, factor._id);
        // let footprint = await footprintRepository.addVariableToFootprint(req.params.id, variable._id);
        return res.status(200).json({message: "Factor saved sucessfuly", factor})
    } catch (error) {
        logger.error('Error when adding Factor to variable', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

module.exports = router;