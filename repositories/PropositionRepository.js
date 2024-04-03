require('dotenv').config();
const Question = require('../models/Question');
const Factor = require("../models/Factor");
const Proposition = require("../models/Proposition");
const Footprint = require('../models/Footprint');
const Variable = require('../models/Variable');

class PropositionRepository {
    async create(datas) {
        try {
            return await Proposition.create(datas);
        } catch (error) {
            console.error("Erreur lors de l'ajout du de la proposition: ", error);
            throw error;
        }
    }
    async  getPropositionsGroupedByHierarchy() {
        try {
            const propositions = await Proposition.aggregate([
                {
                    $lookup: {
                        from: 'questions',
                        localField: 'questionId',
                        foreignField: '_id',
                        as: 'question'
                    }
                },
                {
                    $unwind: '$question'
                },
                {
                    $lookup: {
                        from: 'factors',
                        localField: 'question.factorId',
                        foreignField: '_id',
                        as: 'factor'
                    }
                },
                {
                    $unwind: '$factor'
                },
                {
                    $lookup: {
                        from: 'variables',
                        localField: 'factor.variableId',
                        foreignField: '_id',
                        as: 'variable'
                    }
                },
                {
                    $unwind: '$variable'
                },
                {
                    $lookup: {
                        from: 'footprints',
                        localField: 'variable.footprintId',
                        foreignField: '_id',
                        as: 'footprint'
                    }
                },
                {
                    $unwind: '$footprint'
                },
                {
                    $group: {
                        _id: {
                            footprint: '$footprint.name',
                            variable: '$variable.name',
                            factor: '$factor.name',
                            question: '$question.label'
                        },
                        propositions: { $push: '$$ROOT' }
                    }
                },
                {
                    $group: {
                        _id: {
                            footprint: '$_id.footprint',
                            variable: '$_id.variable',
                            factor: '$_id.factor'
                        },
                        questions: {
                            $push: {
                                question: '$_id.question',
                                propositions: '$propositions'
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            footprint: '$_id.footprint',
                            variable: '$_id.variable'
                        },
                        factors: {
                            $push: {
                                factor: '$_id.factor',
                                questions: '$questions'
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            footprint: '$_id.footprint'
                        },
                        variables: {
                            $push: {
                                variable: '$_id.variable',
                                factors: '$factors'
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        footprints: {
                            $push: {
                                footprint: '$_id.footprint',
                                variables: '$variables'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        footprints: 1
                    }
                }
            ]);

            return propositions;
        } catch (error) {
            console.error("Erreur lors de la récupération des propositions:", error);
            throw error;
        }
    }

}



const propositionRepository = new PropositionRepository();
module.exports = propositionRepository;