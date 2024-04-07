require('dotenv').config();
const Answer = require('../models/Answer');
const Usager = require('../models/Usager');
const Quiz = require('../models/Quiz');
const calculPointRepository = require('../repositories/CaculPointRepository');
const {ObjectId} = require("mongodb");


class AnswerRepository {

    async create(usager, propositions, quizId) {
        try {
            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                throw new Error('Quiz doesn\'t exist !');
            }
            let resultUsager = await Usager.findOne({email: usager.email});
            if (!resultUsager) {
                resultUsager =  await Usager.create(usager);
            }
            let datas = [];
            propositions.forEach((value) => {
                datas.push({
                    propositionId: new ObjectId(value.id),
                    usagerId: resultUsager._id,
                    quizId: new ObjectId(quizId),
                    value: value.value
                })
            })
            console.log(datas)


            const promises = datas.map(async (value) => {
                console.log("Creating Answer with value:", value);
                return await Answer.create(value);
            });
            const answers = await Promise.all(promises);
            return await calculPointRepository.calculEmpreinte(resultUsager._id, quiz.companyId, '660ef07d12bd44b5e6ae8085',quizId);

        } catch (error) {
            console.error(error)
            throw error;
        }

    }

}

const answerRepository = new AnswerRepository();
module.exports = answerRepository;