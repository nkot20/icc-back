// FootprintSchema.js
const mongoose = require('mongoose');

const footprintSchema = new mongoose.Schema({
    name: {
        type: String,
    },
}, { timestamps: true });

const footprint = mongoose.model('footprint', footprintSchema);

module.exports = footprint;
