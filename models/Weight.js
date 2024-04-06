const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
    value: { /// to know if question is a exam question with points or it's just to get information (factor weight or information)
        type: Boolean,
    },
    factorId: { type: mongoose.Schema.Types.ObjectId, ref: 'factors' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' }
}, { timestamps: true });

const weight = mongoose.model('weight', weightSchema);

module.exports = weight;
