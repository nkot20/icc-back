const Joi = require('joi');
const express = require('express');
const companyUserRepository = require('../../repositories/companyUserRepository');
const validateSchema = require('../../middlewares/validationSchema');
const router = express.Router();
const Roles = require('../../config/role');

const CompanyCreateSchema = Joi.object({
    company: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        additionalAddress: Joi.optional(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        ville: Joi.string().required()
    }).required(),
    manager: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        contryCode: Joi.string().required(),
        passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
    }).required(),

});

router.post('/', validateSchema(CompanyCreateSchema), async (req, res) => {
    const {
        company, customization, manager, stripe, feature,
    } = req.body;

    const userPayload = {
        user_login: manager.phoneNumber,
        email: manager.email,
        user_pass: manager.password,
        first_name: manager.firstName,
        last_name: manager.lastName,
        mobile_no: manager.phoneNumber,
        country_code: manager.contryCode,
        role: [Roles.COMPANY_ADMIN],
    };
    
    try {
        // Add custom fields atm :
        company.status = 'Active';
        company.domains = [];

        // create company subscription plan

        await companyUserRepository.createCompany(company, userPayload);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error.message,
        });
    }
})

module.exports = router;