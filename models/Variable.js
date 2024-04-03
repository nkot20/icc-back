// VariableModel.js
const mongoose = require('mongoose');

const VariableSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    isAddedByCompany: {
        type: Boolean,
        default: false,
    },
    //factors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'factors' }], // Les facteurs liés à cette variable
    variables: [{ type: mongoose.Schema.Types.ObjectId, ref: 'variables' }], // Les variables liées à cette variable
    footprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'footprints' }
}, { timestamps: true });

const Variable = mongoose.model('variable', VariableSchema);

module.exports = Variable;
