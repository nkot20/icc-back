// FactorModel.js
const mongoose = require('mongoose');

const FactorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isAddedByCompany: {
        type: Boolean,
        default: false,
    },
    variableId: { type: mongoose.Schema.Types.ObjectId, ref: 'variables' }
}, { timestamps: true });

const Factor = mongoose.model('factor', FactorSchema);

module.exports = Factor;
