// middleware qui capture et traite toutes les erreurs
function errorHandler(err, req, res, next) {
    console.error(err.stack); // Affiche l'erreur dans la console

    // Envoyer une réponse d'erreur appropriée au client
    res.status(500).json({ error: 'Une erreur est survenue sur le serveur.' });
}

// middleware pour gérer les erreurs asynchrones
function asyncErrorHandler(fn) {
    return function(req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// middleware pour gérer les routes inconnues
function notFoundHandler(req, res, next) {
    res.status(404).json({ error: 'Route non trouvée.' });
}

module.exports = {
    errorHandler,
    asyncErrorHandler,
    notFoundHandler
};
