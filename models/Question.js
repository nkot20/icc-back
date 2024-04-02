const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    isForWeight: {
        type: Boolean,
        default: false,
    },
    factorId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'factors' }]
});

const Question = mongoose.model('question', questionSchema);

module.exports = Question;
