const Joi = require('joi');
const express = require('express');
const footprintRepository = require('../../../repositories/FootprintRepository');
const variableRepository = require('../../../repositories/VariableRepository');
const factorRepository = require('../../../repositories/FactorRepository');
const validateSchema = require('../../../middlewares/validationSchema');
const router = express.Router();
const logger = require('../../../logger');
const authMiddleware = require('../../../middlewares/authenticate.middleware');
const questionRepository = require("../../../repositories/QuestionRepository");
const factorCreateSchema = Joi.object({
    name: Joi.string().required(),
});

router.post('/variable/add', async (req, res) => {
    try {
        const datas = req.body;
        const promise = datas.map(async (value) => {
            return await factorRepository.create(value);
        });
        const response = await Promise.all(promise);

        //const variable = await variableRepository.addFactorToVariable(req.params.id, factor._id);
        // let footprint = await footprintRepository.addVariableToFootprint(req.params.id, variable._id);
        return res.status(200).json({message: "Factor saved sucessfuly", response})
    } catch (error) {
        logger.error('Error when adding Factor to variable', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

router.get('/weight', async (req, res) => {
    try {
       const response = await factorRepository.getListeFacteursAvecPoids();
        //const variable = await variableRepository.addFactorToVariable(req.params.id, factor._id);
        // let footprint = await footprintRepository.addVariableToFootprint(req.params.id, variable._id);
        return res.status(200).json({message: "Factors got sucessfuly", response})
    } catch (error) {
        logger.error('Error when getting Factor', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

//update weight factor by company
router.post('/weight/add', async (req, res) => {
    try {
        const response = await factorRepository.addWeight({
            value: req.body.value,
            factorId: req.body.factorId,
            companyId: req.body.companyId
        });
        //const variable = await variableRepository.addFactorToVariable(req.params.id, factor._id);
        // let footprint = await footprintRepository.addVariableToFootprint(req.params.id, variable._id);
        return res.status(200).json({message: "Weight added sucessfuly", response})
    } catch (error) {
        logger.error('Error when adding weight to Factor', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
});

router.get('/group-by-var/:id', async (req, res) => {
    try {
        const response = await variableRepository.getVariablesByCompany(req.params.id);
        res.status(200).send(response);
    } catch (error) {
        logger.error('Error when getting Factor', { error: error });
        return res.status(400).json({
            error: error.message,
        });
    }
})

module.exports = router;