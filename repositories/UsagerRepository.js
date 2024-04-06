const Usager = require('../models/Usager');
const calculPointRepository = require('../repositories/CaculPointRepository');
const Answer = require('../models/Answer');
class UsagerRepository {

    async getListeUsagersRepondusAuQuizz(quizId, companyId, empreinteId) {
        try {
            // Récupérer les réponses distinctes pour le quiz donné
            const distinctReponses = await Answer.distinct('usagerId', { quizId }).lean();

            // Créer un objet pour stocker le nombre de points de chaque usager
            const pointsUsagers = {};

            // Pour chaque usager ayant répondu au quiz, calculer le nombre de points
            await Promise.all(distinctReponses.map(async (usagerId) => {
                // Calculer le nombre de points pour cet usager en utilisant la fonction calculFinalPoint
                const points = await calculPointRepository.calculFinalPoint(usagerId, companyId, empreinteId, quizId);
                pointsUsagers[usagerId] = points;
            }));

            // Récupérer les informations de chaque usager et ajouter le nombre de points
            const usagersAvecPoints = await Promise.all(distinctReponses.map(async (usagerId) => {
                // Récupérer les informations de l'usager
                const usager = await Usager.findById(usagerId).lean();

                // Renvoyer l'usager avec le nombre de points
                return {
                    ...usager,
                    points: Math.floor(pointsUsagers[usagerId]) || 0 // Si l'usager n'a pas de points calculés, mettre 0
                };
            }));

            return usagersAvecPoints;
        } catch (error) {
            console.error("Une erreur est survenue lors de la récupération de la liste des usagers:", error);
            return [];
        }
    }


}

const usagerRepository = new UsagerRepository();
module.exports = usagerRepository;