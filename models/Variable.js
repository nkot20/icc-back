// variableModel.js
const mongoose = require('mongoose');

const factorSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    factors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'factors' }]
});

const VariableSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    isAddedByCompany: {
        type: Boolean,
        default: false,
    },
    factors: [factorSchema]
});

const Variable = mongoose.model('variable', VariableSchema);

module.exports = Variable;
