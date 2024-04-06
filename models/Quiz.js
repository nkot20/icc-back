const mongoose = require('mongoose');
const crypto = require('crypto');

const { Schema } = mongoose;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const quizSchema = Schema({
    companyId: [{ type: Schema.Types.ObjectId, ref: 'companies' }],
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    minMean: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },


}, { timestamps: true });

// Function to generate a random alphanumeric string of a given length


quizSchema.plugin(aggregatePaginate);
module.exports = quiz = mongoose.model('quiz', quizSchema);
