// FootprintSchema.js
const mongoose = require('mongoose');


const quizQuestionSchema = new mongoose.Schema({
    quizId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'quizzes' }],
    questionId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'questions' }],
});

const footprint = mongoose.model('quizQuestion', quizQuestionSchema);

module.exports = footprint;
