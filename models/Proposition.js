const mongoose = require('mongoose');

const propositionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    isForWeight: {
        type: Boolean,
        default: false,
    },
    questionId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'questions' }]
});

const Question = mongoose.model('proposition', propositionSchema);

module.exports = Question;
