const factory = require('./handlerFactory');
const Node = require('../models/nodeModel');
const Graph = require('../models/graphModel');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');
// const factoryUtils = require('../utils/handlerFactoryUtils');

// Admin Controller
exports.getAllNodes = factory.getAll(Node, {
  nestedParams: { graph: 'graphId' }
});
exports.createNode = factory.createOne(Node);

exports.getNode = factory.getOne(Node);
exports.deleteNode = factory.deleteOne(Node);

// User Controller
exports.getAllMyNodes = factory.getAllMy(Node, {
  nestedParams: { graph: 'graphId' }
});
exports.createMyNode = factory.createMyParentsOne(Node, Graph, 'graph');

// exports.createMyNode = catchAsync(async (req, res, next) => {
//   // 1) Get the user id
//   const userId = req.user.uid;

//   // 2) Get user inputted data for the new node
//   const { graph: graphId, xLocation, yLocation } = req.body;

//   // 3) Get graph from the inputted graphId
//   const graph = await Graph.findById(graphId);

//   // 4) Check if the graph exists and if the user owns this graph
//   if (!graph || (graph && graph.user !== userId)) {
//     return next(new AppError('The graph inputted does not exist'), 400);
//   }

//   // 5) Create the new node
//   const node = await Node.create({ graph: graphId, xLocation, yLocation });

//   // 6) Send response
//   factoryUtils.sendOneCreated(Node, res, next, node);
// });

exports.getMyNode = factory.getMyOne(Node);
exports.updateMyNode = factory.updateMyOne(Node);
exports.deleteMyNode = factory.deleteMyOne(Node);
