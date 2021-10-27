const factory = require('./handlerFactory');
const Solution = require('../models/solutionModel');

exports.getAllSolutions = factory.getAll(Solution);
exports.createSolution = factory.createOne(Solution);

exports.getSolution = factory.getOne(Solution);
exports.updateSolution = factory.updateOne(Solution);
exports.deleteSolution = factory.deleteOne(Solution);
