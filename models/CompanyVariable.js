// FootprintSchema.js
const mongoose = require('mongoose');


const companyVariableSchema = new mongoose.Schema({
    companyId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'companies' }],
    variableId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'variables' }],
}, { timestamps: true });

const companyVariable = mongoose.model('companyVariables', companyVariableSchema);

module.exports = companyVariable;
