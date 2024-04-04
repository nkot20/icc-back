require('dotenv').config();
const Answer = require('../models/Answer');
const Usager = require('../models/Usager');
const {ObjectId} = require("mongodb");

class AnswerRepository {

    async create(usager, propositions, quizId) {
        try {
            let result = await Usager.findOne({email: usager.email});
            if (!result) {
                result =  await Usager.create(usager);
            }
            let datas = [];
            propositions.forEach((value) => {
                datas.push({
                    propositionId: new ObjectId(value),
                    usagerId: result._id,
                    quizId: new ObjectId(quizId)
                })
            })
            console.log(datas)


            const promises = datas.map(async (value) => {
                console.log("Creating Answer with value:", value);
                return await Answer.create(value);
            });
            return await Promise.all(promises);
        } catch (error) {
            console.error(error)
            throw error;
        }

    }

}

const answerRepository = new AnswerRepository();
module.exports = answerRepository;