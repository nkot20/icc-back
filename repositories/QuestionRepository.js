require('dotenv').config();
const Question = require('../models/Question');
const Factor = require("../models/Factor");

class QuestionRepository {
    async create(question) {
        try {
            return await Question.create(question);
        } catch (error) {
            console.error("Something went to wrong: ", error);
            throw error;
        }
    }

}

const questionRepository = new QuestionRepository();
module.exports = questionRepository;