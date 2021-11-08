const factory = require('./handlerFactory');
const Solution = require('../models/solutionModel');

// Admin Based Controllers
exports.getAllSolutions = factory.getAll(Solution, {
  nestedParams: [{ problem: 'problemId' }],
});
exports.getSolution = factory.getOne(Solution);
exports.deleteSolution = factory.deleteOne(Solution);

// User Based Controllers
exports.getAllMySolutions = factory.getAllMy(Solution, {
  nestedParams: [{ problem: 'problemId' }],
});
exports.createMySolution = factory.createMyOne(Solution);

exports.getMySolution = factory.getMyOne(Solution);
exports.updateMySolution = factory.updateMyOne(Solution);
