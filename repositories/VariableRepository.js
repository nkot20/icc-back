require('dotenv').config();

const Footprint = require('../models/Footprint');
const Variable = require('../models/Variable');
const Factor = require('../models/Factor');
const Weight = require('../models/Weight');

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

    async getVariablesByCompany(companyId) {
        try {
            // Récupérer les variables avec leurs facteurs
            const variablesWithFactors = await Variable.aggregate([
                {
                    $lookup: {
                        from: 'factors',
                        localField: '_id',
                        foreignField: 'variableId',
                        as: 'factors'
                    }
                }
            ]);

            // Pour chaque variable, ajouter les poids correspondants aux facteurs
            const variablesWithWeights = await Promise.all(variablesWithFactors.map(async (variable) => {
                // Pour chaque facteur de la variable
                const promises = variable.factors.map(async (factor) => {
                    // Récupérer le poids le plus récent pour ce facteur et cette société
                    const weight = await Weight.findOne({ factorId: factor._id, companyId })
                        .sort({ createdAt: -1 })
                        .limit(1);

                    // Si un poids est trouvé, utiliser sa valeur, sinon utiliser le poids par défaut
                    console.log(factor.dafaultWeight)
                    if (weight !== undefined && weight !== null) {
                        factor.latestWeight = weight.value;
                    }
                    if (weight === undefined || weight === null) {
                        factor.latestWeight = factor.dafaultWeight;
                    }
                    console.log(factor)
                    return factor;
                });


//              Attendre que toutes les promesses se résolvent
                await Promise.all(promises);

                return {
                    _id: variable._id,
                    name: variable.name,
                    factors: variable.factors
                };
            }));

            return variablesWithWeights;

        } catch (error) {
            throw error;
        }
    }

}

const variableRepository = new VariableRepository();
module.exports = variableRepository;