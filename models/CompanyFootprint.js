// FootprintSchema.js
const mongoose = require('mongoose');


const companyFootprintSchema = new mongoose.Schema({
    companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'companies' }],
    footprintId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'footprints' }],
});

const footprint = mongoose.model('companyFootprints', companyFootprintSchema);

module.exports = footprint;
