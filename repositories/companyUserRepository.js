require('dotenv').config();

const Company = require('../models/Company');
const User = require('../models/User');
const Client = require('../ClientMongo/MongoClientTransaction')

class CompanyUserRepository {
    
    /**
     * create company and user that will be admin to this company
     * @param company
     * @param user
     * @returns {Promise<void>}
     */
    async createCompany (company, user) {
        const client = Client.getClient();
        const session = client.startSession();

        try {
            session.startTransaction();
            const userClient = client.db("ICC").collection("users");
            const result_save_user = await userClient.insertOne(user);
            const companyClient = client.db("ICC").collection("companies");
            company.adminId = result_save_user.insertedId;
            await companyClient.insertOne(company);
            await session.commitTransaction();
        } catch (error) {
            console.log("An error occurred during the transaction:" + error);
            await session.abortTransaction();
        } finally {
            await session.endSession();
        }
    }
    
}

const companyUserRepository = new CompanyUserRepository();

module.exports = companyUserRepository;