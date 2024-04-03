// FootprintSchema.js
const mongoose = require('mongoose');

const footprintSchema = new mongoose.Schema({
    name: {
        type: String,
    },
});

const footprint = mongoose.model('footprint', footprintSchema);

module.exports = footprint;
