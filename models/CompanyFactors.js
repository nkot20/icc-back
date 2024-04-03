// FootprintSchema.js
const mongoose = require('mongoose');


const companyFactorSchema = new mongoose.Schema({
    companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'companies' }],
    factorId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'factors' }],
}, { timestamps: true });

const footprint = mongoose.model('companyFactor', companyFactorSchema);

module.exports = footprint;
