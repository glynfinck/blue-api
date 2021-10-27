const factory = require('./handlerFactory');
const Edge = require('../models/edgeModel');

exports.getAllEdges = factory.getAll(Edge, { graph: 'graphId' });
exports.createEdge = factory.createOne(Edge);

exports.getEdge = factory.getOne(Edge);
exports.updateEdge = factory.updateOne(Edge);
exports.deleteEdge = factory.deleteOne(Edge);
