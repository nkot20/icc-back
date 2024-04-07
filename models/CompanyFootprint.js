// FootprintSchema.js
const mongoose = require('mongoose');


const companyFootprintSchema = new mongoose.Schema({
    companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'companies' }],
    footprintId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'footprints' }],
}, { timestamps: true });

const companyFoot = mongoose.model('companyFootprints', companyFootprintSchema);

module.exports = companyFoot;
