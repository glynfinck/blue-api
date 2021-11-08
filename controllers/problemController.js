const factory = require('./handlerFactory');
const Problem = require('../models/problemModel');
const Graph = require('../models/graphModel');
const Solution = require('../models/solutionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllProblems = factory.getAll(Problem);
exports.createProblem = factory.createOne(Problem);

exports.getProblem = factory.getOne(Problem);
exports.updateProblem = factory.updateOne(Problem);
exports.deleteProblem = factory.deleteOne(Problem);
