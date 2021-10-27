const factory = require('./handlerFactory');
const Problem = require('../models/problemModel');

exports.getAllProblems = factory.getAll(Problem);
exports.createProblem = factory.createOne(Problem);

exports.getProblem = factory.getOne(Problem);
exports.updateProblem = factory.updateOne(Problem);
exports.deleteProblem = factory.deleteOne(Problem);
