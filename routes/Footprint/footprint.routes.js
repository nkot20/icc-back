const Joi = require('joi');
const express = require('express');
const footprintRepository = require('../../repositories/FootprintRepository');
const variableRepository = require('../../repositories/VariableRepository');
const validateSchema = require('../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../logger');
const authMiddleware = require('../../middlewares/authenticate.middleware');
const footprintCreateSchema = Joi.object({
    name: Joi.string().required(),
});

const variableCreateSchema = Joi.object({
    name: Joi.string().required(),
});

//create footprint
router.post('/', validateSchema(footprintCreateSchema), async (req, res)  => {
    try {
        let footprint = await footprintRepository.createFootprint(req.body);
        return res.status(200).json({message: "footprint saved sucessfuly", footprint})
    } catch (error) {
        logger.error('Error when creating footprint', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
});

//add variable to footprint
router.patch('/variable/add/:id', validateSchema(variableCreateSchema), async (req, res) => {
    try {
        let datas = {
            name: req.body.name,
            footprintId: req.params.id
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
})

module.exports = router;


