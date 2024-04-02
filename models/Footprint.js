// FootprintSchema.js
const mongoose = require('mongoose');

const variableSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    factors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'factors' }]
});

const footprintSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    variables: [variableSchema]
});

const footprint = mongoose.model('footprint', footprintSchema);

module.exports = footprint;
