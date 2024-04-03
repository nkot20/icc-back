require('dotenv').config();

const Footprint = require('../models/Footprint');
const Variable = require('../models/Variable');
const Factor = require('../models/Factor');

class FactorRepository {
    async create(factor) {
        try {
            return await Factor.create(factor);
        } catch (error) {
            console.error("Erreur lors de l'ajout du facteur:", error);
            throw error;
        }
    }

    async delete(factorId) {
        try {
            return await Factor.deleteOne(factorId);
        } catch (error) {
            console.error("Erreur lors de la suppression du facteur:", error);
            throw error;
        }
    }
}