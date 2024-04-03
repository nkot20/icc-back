const mongoose = require('mongoose');

const propositionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'questions' }
}, { timestamps: true });

const Question = mongoose.model('proposition', propositionSchema);

module.exports = Question;
