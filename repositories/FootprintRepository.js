require('dotenv').config();

const Footprint = require('../models/Footprint');
const Variable = require('../models/Variable');
const Factor = require('../models/Factor');


class FootprintRepository {
    async createFootprint(footprintName) {
        try {
            const newFootprint = new Footprint({ name: footprintName });
            return await newFootprint.save();
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
            let footprint = await Footprint.findById(footprintId);

            // Vérifier si l'empreinte existe
            if (!footprint) {
                throw new Error("L'empreinte n'existe pas.");
            }

            // Ajouter l'ID de la variable à la liste des variables de l'empreinte
            footprint.variables.push(variableId);

            // Enregistrer les modifications de l'empreinte
            await Footprint.updateOne(footprint);

            return footprint;
        } catch (error) {
            console.error("Erreur lors de l'ajout de la variable à l'empreinte:", error);
            throw error;
        }
    }

}