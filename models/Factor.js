// factorModel.js
const mongoose = require('mongoose');

const FactorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    isAddedByCompany: {
        type: Boolean,
        default: false,
    }
});

const Factor = mongoose.model('factor', FactorSchema);

module.exports = Factor;
