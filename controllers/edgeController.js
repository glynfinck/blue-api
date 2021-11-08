const factory = require('./handlerFactory');
const Edge = require('../models/edgeModel');
const Graph = require('../models/graphModel');

// Admin Controller
exports.getAllEdges = factory.getAll(Edge, {
  nestedRoutes: { graph: 'graphId' }
});

exports.getEdge = factory.getOne(Edge);
exports.deleteEdge = factory.deleteOne(Edge);

// User Controller
exports.getAllMyEdges = factory.getAllMy(Edge, {
  nestedRoutes: { graph: 'graphId' }
});
exports.createMyEdge = factory.createMyParentsOne(Edge, Graph, 'graph');

exports.getMyEdge = factory.getMyOne(Edge);
exports.deleteMyEdge = factory.deleteMyOne(Edge);
