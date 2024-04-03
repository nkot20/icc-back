require('dotenv').config();

const Footprint = require('../models/Footprint');
const Variable = require('../models/Variable');
const Factor = require('../models/Factor');

class VariableRepository {
    async create(variable) {
        try {
            return await Variable.create(variable);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la variable:", error);
            throw error;
        }
    }

    async removeVariable(variableId) {
        try {
            // Supprimer la variable elle-même
            await Variable.findByIdAndDelete(variableId);

            // Supprimer cette variable de toutes les autres variables qui la référencent
            await Variable.updateMany({ variables: variableId }, { $pull: { variables: variableId } });

            // Supprimer cette variable de toutes les empreintes qui la référencent
            await Footprint.updateMany({ variables: variableId }, { $pull: { variables: variableId } });
        } catch (error) {
            console.error("Erreur lors de la suppression de la variable:", error);
            throw error;
        }
    }

    async removeFactorFromVariable(variableId, factorId) {
        try {
            const variable = await Variable.findById(variableId);
            variable.factors.pull(factorId); // Retirer le facteur du tableau des facteurs
            return Variable.updateOne(variable);
        } catch (error) {
            console.error("Erreur lors de la suppression du facteur de la variable:", error);
            throw error;
        }
    }

    async addFactorToVariable(variableId, factorId) {
        try {
            const variable = await Variable.findById(variableId);
            variable.factors.push(factorId);
            return await Variable.updateOne(variable);
        } catch (error) {
            console.error("Erreur lors de l'ajout du facteur à la variable:", error);
            throw error;
        }
    }

    async addVariableToVariable(parentVariableId, childVariableId) {
        try {
            const parentVariable = await Variable.findById(parentVariableId);
            parentVariable.variables.push(childVariableId);
            return await Variable.updateOne(parentVariable)
        } catch (error) {
            console.error("Erreur lors de l'ajout de la variable à la variable:", error);
            throw error;
        }
    }
}