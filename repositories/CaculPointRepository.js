const async = require('async');
const Variable = require('../models/Variable');
const Factor = require('../models/Factor');
const Answer = require('../models/Answer');
const Weight = require('../models/Weight');
const Proposition = require('../models/Proposition');
const Question = require('../models/Question');

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

            console.log("Note finale de l'usager pour l'empreinte:", (finalMean/7)*6080);
            return (finalMean/7)*6080;
        } catch (error) {
            console.error("Une erreur est survenue lors du calcul de la note finale:", error);
        }
    };


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

}

const calculPointRepository = new CaculPointRepository();
module.exports = calculPointRepository;