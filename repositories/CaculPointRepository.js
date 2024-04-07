const async = require('async');
const Variable = require('../models/Variable');
const Factor = require('../models/Factor');
const Answer = require('../models/Answer');
const Weight = require('../models/Weight');
const Proposition = require('../models/Proposition');
const Question = require('../models/Question');
const Footprint = require('../models/Footprint');

class CaculPointRepository {


    // Fonction pour calculer la note finale
    // Fonction pour calculer la note finale
    async calculFinalPoint(usagerId, companyId, empreinteId, quizId) {
        try {

            // Récupérer les réponses de l'usager pour le quiz donné
            const answers = await Answer.find({ usagerId: usagerId, quizId: quizId }).lean();

            // Récupérer les IDs des propositions des réponses de l'usager
            const propositionIds = answers.map(answer => answer.propositionId);

            // Récupérer les détails des propositions associées aux réponses de l'usager
            const propositions = await Proposition.find({ _id: { $in: propositionIds } }).lean();

            // Créer un objet pour stocker les valeurs des propositions par facteur
            const facteurPropositionValues = {};

            // Associer chaque proposition à son facteur et calculer la somme des valeurs des propositions pour chaque facteur
            // Récupérer les détails de toutes les questions associées aux propositions
            const questionsPromises = propositions.map(async proposition => {
                const questionId = proposition.questionId;
                const question = await Question.findById(questionId).lean(); // Attendre la résolution de la promesse

                return { question, proposition }; // Retourner l'objet contenant à la fois la question et la proposition associée
            });

            // Attendre la résolution de toutes les promesses pour obtenir les détails de toutes les questions
            const questionsResults = await Promise.all(questionsPromises);

            // Parcourir les résultats pour calculer la somme des valeurs des propositions pour chaque facteur
            questionsResults.forEach(({ question, proposition }) => {
                if (question && question.factorId) {
                    const facteurId = question.factorId.toString(); // Convertir en chaîne pour la comparaison
                    const propositionValue = proposition.value;

                    if (!facteurPropositionValues[facteurId]) {
                        facteurPropositionValues[facteurId] = propositionValue;
                    } else {
                        facteurPropositionValues[facteurId] += propositionValue;
                    }
                }
            });


            // Récupérer les poids les plus récents attribués par la company aux facteurs
            const weights = await Weight.find({ company: companyId }).lean();

            // Créer un objet pour stocker les poids les plus récents attribués par la company aux facteurs
            const facteurLatestWeights = {};
            weights.forEach(weight => {
                const factorId = weight.factorId.toString(); // Convertir en chaîne pour la comparaison
                if (!facteurLatestWeights[factorId] || weight.createdAt > facteurLatestWeights[factorId].createdAt) {
                    facteurLatestWeights[factorId] = weight;
                }
            });

            // Récupérer les valeurs des poids par défaut des facteurs
            const defaultWeights = await Weight.find({}).lean();

            // Créer un objet pour stocker les valeurs par défaut des poids des facteurs
            const defaultFacteurWeights = {};
            defaultWeights.forEach(weight => {
                const factorId = weight.factorId.toString(); // Convertir en chaîne pour la comparaison
                if (!defaultFacteurWeights[factorId] || weight.createdAt > defaultFacteurWeights[factorId].createdAt) {
                    defaultFacteurWeights[factorId] = weight.defaultWeight;
                }
            });

            // Créer un tableau de promesses pour calculer la moyenne pondérée des valeurs des facteurs
            const facteurWeightedAveragesPromises = Object.entries(facteurPropositionValues).map(([factorId, propositionSum]) => {
                return new Promise(resolve => {
                    const weight = facteurLatestWeights[factorId];
                    const factorWeight = weight ? weight.value : (defaultFacteurWeights[factorId] || 6); // Utiliser le poids le plus récent attribué par la company, sinon utiliser le poids par défaut
                    const totalWeight = factorWeight;

                    const facteurWeightedAverage = propositionSum / totalWeight;
                    resolve(facteurWeightedAverage);
                });
            });

            // Calculer la moyenne pondérée des valeurs des facteurs en parallèle
            const facteurWeightedAverages = await Promise.all(facteurWeightedAveragesPromises);

            // Calculer la moyenne des valeurs des facteurs obtenues
            const finalMean = facteurWeightedAverages.reduce((acc, facteurWeightedAverage) => acc + facteurWeightedAverage, 0) / facteurWeightedAverages.length;

            console.log("Note finale de l'usager pour l'empreinte:", (finalMean/7)*1026);
            return (finalMean/7)*1216;
        } catch (error) {
            console.error("Une erreur est survenue lors du calcul de la note finale:", error);
        }
    };


    async calculEmpreinte(usagerId, companyId, empreinteId, quizId) {
        try {
            // Récupérer toutes les réponses de l'usager pour le quiz donné
            const reponses = await Answer.find({ quizId, usagerId }).lean();

            // Tableaux pour stocker les valeurs des questions et des propositions
            const valueQuestion = {};
            const valueProposition = {};

            // Calculer la valeur de réponse pour chaque question répondue par l'usager
            const propositionPromises = reponses.map(async reponse => {
                const propositionId = reponse.propositionId;
                const proposition = await Proposition.findById(propositionId).lean();
                const questionId = proposition.questionId.toString();

                // Retourner un objet contenant l'ID de la question et la valeur de la proposition
                return { questionId, propositionValue: proposition.value, responseValue: reponse.value };
            });

            const propositionsResults = await Promise.all(propositionPromises);

            propositionsResults.forEach(result => {
                const { questionId, propositionValue, responseValue } = result;

                // Ajouter la valeur de la proposition à la question correspondante
                valueProposition[questionId] = (valueProposition[questionId] || 0) + propositionValue;

                // Ajouter la valeur de réponse de la proposition à la question
                const valeurReponse = responseValue ? 7 : 1;
                valueQuestion[questionId] = (valueQuestion[questionId] || 0) + valeurReponse;
            });

            // Calculer la valeur de chaque facteur
            const facteurs = await this.getFactorsOfFootprint(empreinteId);
            const valeurFacteurs = {};

            const questionPromises = facteurs.map(async facteur => {
                const questions = await Question.find({ factorId: facteur._id }).lean();

                let facteurValue = 0;
                questions.forEach(question => {
                    const questionId = question._id.toString();
                    const valueProp = valueProposition[questionId] || 0;
                    const valueQuest = valueQuestion[questionId] || 0;

                    // Si les valeurs sont égales, ajouter 7 sinon ajouter 1
                    facteurValue += (valueProp === valueQuest) ? 7 : 1;
                });

                valeurFacteurs[facteur._id] = facteurValue;
            });

            await Promise.all(questionPromises);

            // Récupérer les poids associés aux facteurs
            const weights = await Weight.find({ company: companyId }).lean();

            // Créer un objet pour stocker les poids les plus récents attribués par la company aux facteurs
            const facteurLatestWeights = {};
            weights.forEach(weight => {
                const factorId = weight.factorId.toString(); // Convertir en chaîne pour la comparaison
                if (!facteurLatestWeights[factorId] || weight.createdAt > facteurLatestWeights[factorId].createdAt) {
                    facteurLatestWeights[factorId] = weight;
                }
            });

            // Récupérer les valeurs des poids par défaut des facteurs
            const defaultWeights = await Weight.find({}).lean();

            // Créer un objet pour stocker les valeurs par défaut des poids des facteurs
            const defaultFacteurWeights = {};
            defaultWeights.forEach(weight => {
                const factorId = weight.factorId.toString(); // Convertir en chaîne pour la comparaison
                if (!defaultFacteurWeights[factorId] || weight.createdAt > defaultFacteurWeights[factorId].createdAt) {
                    defaultFacteurWeights[factorId] = weight.defaultWeight;
                }
            });
            console.log(valeurFacteurs, defaultFacteurWeights, valeurFacteurs)
            // Créer un tableau de promesses pour calculer la moyenne pondérée des valeurs des facteurs
            const facteurWeightedAveragesPromises = Object.entries(valeurFacteurs).map(([factorId, propositionSum]) => {
                return new Promise(resolve => {
                    const weight = facteurLatestWeights[factorId];
                    const factorWeight = weight ? weight.value : (defaultFacteurWeights[factorId] || 6); // Utiliser le poids le plus récent attribué par la company, sinon utiliser le poids par défaut
                    const totalWeight = factorWeight;

                    const facteurWeightedAverage = propositionSum / totalWeight;
                    resolve(facteurWeightedAverage);
                });
            });

            // Calculer la moyenne pondérée des valeurs des facteurs en parallèle
            const facteurWeightedAverages = await Promise.all(facteurWeightedAveragesPromises);

            // Calculer la moyenne des valeurs des variables obtenues
            const moyenneValeursVariables = facteurWeightedAverages.reduce((acc, val) => acc + val, 0) / facteurWeightedAverages.length;

            console.log("L'empreinte finale de l'usager est:", (moyenneValeursVariables/7)*1216);
            return (moyenneValeursVariables/7)*1216;
        } catch (error) {
            console.error("Une erreur est survenue lors du calcul de l'empreinte:", error);
            return null;
        }
    }


    async test() {
        const answers = await Answer.find();
        const promise = answers.map(async (value)=> {
            const proposition = await Proposition.findById(value.propositionId);
            if (!proposition) {
                throw new Error('proposition with id ' +value.propositionId + ' doesn\'t exist')
            }
            return proposition;
        })
        return await Promise.all(promise);
    }


    async getFactorsOfFootprint(footprintId) {
        try {
            // Rechercher les variables associées à l'empreinte
            const variables = await Variable.find({ footprintId: footprintId });

            if (!variables || variables.length === 0) {
                throw new Error('Aucune variable trouvée pour cette empreinte');
            }

            // Récupérer les IDs des variables
            const variableIds = variables.map(variable => variable._id);

            // Rechercher les facteurs associés à ces variables
            const factors = await Factor.find({ variableId: { $in: variableIds } });

            return factors;
        } catch (error) {
            console.error('Une erreur est survenue lors de la récupération des facteurs de l\'empreinte:', error);
            throw error;
        }
    }

    async getMinimumPointsByVariable(companyId, quizId, empreinteId) {
        try {
            // Récupérer tous les usagers ayant répondu au quiz donné
            const usagers = await Answer.distinct('usagerId', { quizId });

            // Tableau pour stocker les valeurs minimales de chaque variable
            const minimumPointsByVariable = {};

            // Pour chaque usager, calculer l'empreinte et mettre à jour les valeurs minimales de chaque variable
            for (const usagerId of usagers) {
                const empreinte = await this.calculEmpreinteByVariable(usagerId, companyId, empreinteId, quizId);

                // Mettre à jour les valeurs minimales de chaque variable
                for (const [variableId, valeur] of Object.entries(empreinte)) {
                    if (!(variableId in minimumPointsByVariable) || valeur < minimumPointsByVariable[variableId]) {
                        minimumPointsByVariable[variableId] = valeur;
                    }
                }
            }

            return minimumPointsByVariable;
        } catch (error) {
            console.error("Une erreur est survenue lors du calcul des points minimums par variable:", error);
            throw error;
        }
    }

    async getMaximumPointsByVariable(companyId, quizId, empreinteId) {
        try {
            // Récupérer tous les usagers ayant répondu au quiz donné
            const usagers = await Answer.distinct('usagerId', { quizId });

            // Tableau pour stocker les valeurs maximales de chaque variable
            const maximumPointsByVariable = {};

            // Pour chaque usager, calculer l'empreinte et mettre à jour les valeurs maximales de chaque variable
            for (const usagerId of usagers) {
                const empreinte = await this.calculEmpreinteByVariable(usagerId, companyId, empreinteId, quizId);

                // Mettre à jour les valeurs maximales de chaque variable
                for (const [variableId, valeur] of Object.entries(empreinte)) {
                    if (!(variableId in maximumPointsByVariable) || valeur > maximumPointsByVariable[variableId]) {
                        maximumPointsByVariable[variableId] = valeur;
                    }
                }
            }

            return maximumPointsByVariable;
        } catch (error) {
            console.error("Une erreur est survenue lors du calcul des points maximums par variable:", error);
            return null;
        }
    }

    async calculEmpreinteByVariable(usagerId, companyId, empreinteId, quizId) {
        try {
            // Récupérer toutes les réponses de l'usager pour le quiz donné
            const reponses = await Answer.find({ quizId, usagerId }).lean();

            // Tableaux pour stocker les valeurs des questions et des propositions
            const valueQuestion = {};
            const valueProposition = {};

            // Calculer la valeur de réponse pour chaque question répondue par l'usager
            const propositionPromises = reponses.map(async reponse => {
                const propositionId = reponse.propositionId;
                const proposition = await Proposition.findById(propositionId).lean();
                const questionId = proposition.questionId.toString();

                // Retourner un objet contenant l'ID de la question et la valeur de la proposition
                return { questionId, propositionValue: proposition.value, responseValue: reponse.value };
            });

            const propositionsResults = await Promise.all(propositionPromises);

            propositionsResults.forEach(result => {
                const { questionId, propositionValue, responseValue } = result;

                // Ajouter la valeur de la proposition à la question correspondante
                valueProposition[questionId] = (valueProposition[questionId] || 0) + propositionValue;

                // Ajouter la valeur de réponse de la proposition à la question
                const valeurReponse = responseValue ? 7 : 1;
                valueQuestion[questionId] = (valueQuestion[questionId] || 0) + valeurReponse;
            });

            // Calculer la valeur de chaque facteur
            const facteurs = await this.getFactorsOfFootprint(empreinteId);
            const valeurFacteurs = {};

            const questionPromises = facteurs.map(async facteur => {
                const questions = await Question.find({ factorId: facteur._id }).lean();

                let facteurValue = 0;
                questions.forEach(question => {
                    const questionId = question._id.toString();
                    const valueProp = valueProposition[questionId] || 0;
                    const valueQuest = valueQuestion[questionId] || 0;

                    // Si les valeurs sont égales, ajouter 7 sinon ajouter 1
                    facteurValue += (valueProp === valueQuest) ? 7 : 1;
                });

                valeurFacteurs[facteur._id] = facteurValue;
            });

            await Promise.all(questionPromises);

            // Récupérer les poids associés aux facteurs
            const weights = await Weight.find({ company: companyId }).lean();

            // Créer un objet pour stocker les poids les plus récents attribués par la company aux facteurs
            const facteurLatestWeights = {};
            weights.forEach(weight => {
                const factorId = weight.factorId.toString(); // Convertir en chaîne pour la comparaison
                if (!facteurLatestWeights[factorId] || weight.createdAt > facteurLatestWeights[factorId].createdAt) {
                    facteurLatestWeights[factorId] = weight;
                }
            });

            // Récupérer les valeurs des poids par défaut des facteurs
            const defaultWeights = await Weight.find({}).lean();

            // Créer un objet pour stocker les valeurs par défaut des poids des facteurs
            const defaultFacteurWeights = {};
            defaultWeights.forEach(weight => {
                const factorId = weight.factorId.toString(); // Convertir en chaîne pour la comparaison
                if (!defaultFacteurWeights[factorId] || weight.createdAt > defaultFacteurWeights[factorId].createdAt) {
                    defaultFacteurWeights[factorId] = weight.defaultWeight;
                }
            });

            // Créer un tableau pour stocker les points de chaque variable
            const pointsByVariable = {};

            // Calculer les points de chaque variable en fonction des valeurs des facteurs
            for (const [facteurId, facteurValue] of Object.entries(valeurFacteurs)) {
                const weight = facteurLatestWeights[facteurId];
                const factorWeight = weight ? weight.value : (defaultFacteurWeights[facteurId] || 6); // Utiliser le poids le plus récent attribué par la company, sinon utiliser le poids par défaut
                const totalWeight = factorWeight;

                // Calculer les points pour chaque variable en fonction des valeurs des facteurs et des poids
                const points = facteurValue / totalWeight;

                // Ajouter les points de la variable correspondante
                const variableId = (await Factor.findById(facteurId).select('variableId').lean()).variableId.toString();
                pointsByVariable[variableId] = points;
            }

            return pointsByVariable;
        } catch (error) {
            console.error("Une erreur est survenue lors du calcul des points pour chaque variable:", error);
            return null;
        }
    }



}

const calculPointRepository = new CaculPointRepository();
module.exports = calculPointRepository;