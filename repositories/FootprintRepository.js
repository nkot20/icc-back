require('dotenv').config();

const Footprint = require('../models/Footprint');
const Variable = require('../models/Variable');
const Factor = require('../models/Factor');


class FootprintRepository {
    async createFootprint(datas) {
        try {
            return await Footprint.create(datas)
        } catch (error) {
            console.error("Erreur lors de la création de l'empreinte:", error);
            throw error;
        }
    }

    async removeFootprint(footprintId) {
        try {
            // Trouver l'empreinte
            const footprint = await Footprint.findById(footprintId);

            // Supprimer toutes les variables de cette empreinte
            const variables = await Variable.find({ _id: { $in: footprint.variables } });

            // Créer un tableau de promesses pour supprimer tous les facteurs de chaque variable
            const factorDeletionPromises = variables.map(variable => {
                return Factor.deleteMany({ _id: { $in: variable.factors } });
            });

            // Attendre que toutes les promesses de suppression des facteurs soient résolues
            await Promise.all(factorDeletionPromises);

            // Supprimer l'empreinte elle-même
            await Footprint.findByIdAndDelete(footprintId);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'empreinte:", error);
            throw error;
        }
    }

    async addVariableToFootprint(footprintId, variableId) {

        try {
            console.log("variable", variableId)
            const footprint = await Footprint.findById(footprintId);

            // Vérifier si l'empreinte existe
            if (!footprint) {
                throw new Error("L'empreinte n'existe pas.");
            }

            // Ajouter l'ID de la variable à la liste des variables de l'empreinte
            let variables = [];
            if (!Array.isArray(footprint.variables)) {
                variables.push(variableId);
            } else {
                variables = footprint.variables;
                variables.push(variableId);
            }

            let newData = {
                name: footprint.name,
                variables: variables,
            }
            console.log(newData)


            // Enregistrer les modifications de l'empreinte
            return await Footprint.updateOne({_id: footprint._id}, newData, {new: true});
        } catch (error) {
            console.error("Erreur lors de l'ajout de la variable à l'empreinte:", error);
            throw error;
        }
    }

}

const footprintRepository = new FootprintRepository();
module.exports = footprintRepository;