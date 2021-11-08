const factory = require('./handlerFactory');
const UserData = require('../models/solutionModel');
const Problem = require('../models/problemModel');
const Solution = require('../models/solutionModel');
const Graph = require('../models/graphModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getMe = catchAsync(async (req, res, next) => {});
exports.deleteMe = catchAsync(async (req, res, next) => {});

exports.getMyProblem = catchAsync(async (req, res, next) => {
  // 1) Get the user id and problem id
  const userId = req.user.uid;
  const problemId = req.params.problemId;
  if (!problemId) {
    next(new AppError('Please provide a problem id', 400));
  }

  // 2) Search for ONE graph and ONE solution with problem id and user id
  const query = { user: userId, problem: problemId };
  const graph = await Graph.findOne(query);
  const solution = await Solution.findOne(query);
  if (!graph) {
    next(new AppError('No graph found for this user and problem'));
  }
  if (!solution) {
    next(new AppError('No solution found for this user and problem'));
  }

  // 3) Send response
  res.status(200).json({
    status: 'success',
    data: {
      graph,
      solution,
    },
  });
});

exports.createMyProblemsGraph = catchAsync(async (req, res, next) => {});
exports.getMyProblemsGraph = catchAsync(async (req, res, next) => {});
exports.createMyProblemsSolution = catchAsync(async (req, res, next) => {});
exports.getMyProblemsGraphsNodes = catchAsync(async (req, res, next) => {});
exports.getMyProblemsGraphsEdges = catchAsync(async (req, res, next) => {});
exports.createNodeForMyProblemsGraph = catchAsync(async (req, res, next) => {});
exports.createEdgeForMyProblemsGraph = catchAsync(async (req, res, next) => {});
exports.deleteNodeForMyProblemsGraph = catchAsync(async (req, res, next) => {});
exports.deleteEdgeForMyProblemsGraph = catchAsync(async (req, res, next) => {});
