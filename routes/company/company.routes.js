const Joi = require('joi');
const express = require('express');
const companyUserRepository = require('../../repositories/companyUserRepository');
const companyRepository = require('../../repositories/companyRepository');
const validateSchema = require('../../middlewares/validationSchema');
const router = express.Router();
const Roles = require('../../config/role');

const CompanyCreateSchema = Joi.object({
    company: Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        additionalAddress: Joi.optional(),
        //legalForm: Joi.string().required(),
        //phoneNumber: Joi.string().required(),
        //email: Joi.string().email().required(),
        //ville: Joi.string().required()
    }).required(),
    manager: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phoneNumber: Joi.string().required(),
        email: Joi.string().email().required(),
        function: Joi.string().required(),
        agreements: Joi.boolean().required()
        //password: Joi.string().required(),
        //contryCode: Joi.string().required(),
        //passwordConfirm: Joi.string().valid(Joi.ref('password')).required(),
    }).required(),

});

router.post('/create', validateSchema(CompanyCreateSchema), async (req, res) => {
    const {
        company, customization, manager, stripe, feature,
    } = req.body;

    const userPayload = {
        //user_login: manager.phoneNumber,
        email: manager.email,
        //user_pass: manager.password,
        first_name: manager.firstName,
        last_name: manager.lastName,
        mobile_no: manager.phoneNumber,
        function: manager.function,
        //country_code: manager.contryCode,
        role: [Roles.COMPANY_ADMIN],
    };
    
    try {
        // Add custom fields atm :
        company.status = 'Active';
        company.domains = [];

        // create company subscription plan

        let response = await companyUserRepository.createCompany(company, userPayload);
        return res.status(200).json("company saved sucessfuly")
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error: error.message,
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const options = {
            page: parseInt(req.query.page, 10) + 1,
            limit: req.query.limit || 10,
            search: req.query.search || '',
            sortDirection: req.query.order === 'asc' ? -1 : 1,
            sortBy: req.query.sort || 'creation_date',
        };

        const response = await companyRepository.getAll(options);

        const pagination = {
            hasNextPage: response.hasNextPage,
            hasPrevPage: response.hasPrevPage,
            limit: response.limit,
            nextPage: response.nextPage,
            page: response.page - 1,
            pagingCounter: response.pagingCounter,
            prevPage: response.prevPage,
            totalDocs: response.totalDocs,
            totalPages: response.totalPages,
        };

        return res.status(200).json({
            companies: response.docs,
            pagination,
        });
    } catch (error) {
        console.log('Error in getting companies', error);
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Something went to wrong.',
        });
    }
});

router.get('/active', async (req, res) => {
    try {
        const response = await companyRepository.getAllActiveCompanies();

        console.log(response);
        return res.status(200).json({
            companies: response,
        });
    } catch (error) {
        console.log('Error in getting active companies', error);
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Something went to wrong.',
        });
    }
});

router.get('/:id', async (req, res) => {
    if (!req.params.id) res.status(400).json({ message: 'need id in params' });

    const { id } = req.params;

    companyRepository.getCompany(id).then(async (result) => {
        if (!result) return res.status(404).json({ message: `no company found with this id ${id}` });

        const company = result;
        const usersCount = await User.countDocuments({ business_code: company.business_code });

        res.json({ company, usersCount });
    }).catch((error) => {
        console.log(error);
        res.status(400).json({
            error: error.message,
        });
    });
});

router.patch('/:id', async (req, res) => {
    if (!req.params.id) res.status(400).json({ message: 'need id in params' });

    const { id } = req.params;

    companyRepository.updateCompany(id, req.body).then((result) => {
        if (!result) return res.status(404).json({ message: `no company found with this id ${id}` });

        res.json(result);
    }).catch((error) => {
        console.log(error);
        res.status(400).json({
            error: error.message,
        });
    });
});

router.get('/all/all-no-pagination', async (req, res) => {
    companyRepository.getAllWithoutPaginnation().then((result) => {
        if (!result) return res.status(404).json({ message: 'no company found' });

        res.send(result);
    }).catch((error) => {
        console.log(error);
        res.status(400).json({
            error: error.message,
        });
    });
});


module.exports = router;