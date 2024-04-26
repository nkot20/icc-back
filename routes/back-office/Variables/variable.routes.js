const Joi = require('joi');
const express = require('express');
const footprintRepository = require('../../../repositories/FootprintRepository');
const variableRepository = require('../../../repositories/VariableRepository');
const validateSchema = require("../../../middlewares/validationSchema");
const logger = require("../../../logger");
const router = express.Router();

const variableCreateSchema = Joi.object({
    name: Joi.string().required(),
    footprintId: Joi.string().required(),
});

/**
 * add variable to a imprint
 */
router.post('/create', validateSchema(variableCreateSchema), async (req, res) => {
    try {
        let datas = {
            name: req.body.name,
            footprintId: req.body.footprintId
        }
        const variable = await variableRepository.create(datas);
        // let footprint = await footprintRepository.addVariableToFootprint(req.params.id, variable._id);
        return res.status(200).json({message: "variable saved sucessfuly", variable})
    } catch (error) {
        logger.error('Error when adding variable to footprint', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
});

/**
 * add child to a variable
 * @param id is id parent variable
 */
router.patch('/add/child/:id', validateSchema(variableCreateSchema), async (req, res) => {
    try {
        let datas = {
            name: req.body.name,
            footprintId: req.body.footprintId
        }
        const variable = await variableRepository.addChildrenToVariable(req.param.id, datas);
        // let footprint = await footprintRepository.addVariableToFootprint(req.params.id, variable._id);
        return res.status(200).json({message: "variable saved sucessfuly", variable})
    } catch (error) {
        logger.error('Error when adding variable to footprint', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

module.exports = router;