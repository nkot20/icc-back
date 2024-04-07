const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['radio', 'checkbox'],
        required: true,
    },
    weighting: { /// to know if question is a exam question with points or it's just to get information (factor weight or information)
        type: Boolean,
    },
    factorId: { type: mongoose.Schema.Types.ObjectId, ref: 'factors' }
}, { timestamps: true });

const question = mongoose.model('question', questionSchema);

module.exports = question;
