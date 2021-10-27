const factory = require('./handlerFactory');
const Graph = require('../models/graphModel');

exports.getAllGraphs = factory.getAll(Graph);
exports.createGraph = factory.createOne(Graph);

exports.getGraph = factory.getOne(Graph, { path: 'nodes' }, { path: 'edges' });
exports.updateGraph = factory.updateOne(Graph);
exports.deleteGraph = factory.deleteOne(Graph);
