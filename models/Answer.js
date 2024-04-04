const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    propositonId: { type: mongoose.Schema.Types.ObjectId, ref: 'propositions' },
    usagerId: { type: mongoose.Schema.Types.ObjectId, ref: 'usagers' },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'quizzes' },
}, { timestamps: true });

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
