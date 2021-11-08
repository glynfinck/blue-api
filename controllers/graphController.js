const factory = require('./handlerFactory');
const Graph = require('../models/graphModel');

// Admin Based Controllers
exports.getAllGraphs = factory.getAll(Graph, {
  nestedParams: { problem: 'problemId' },
});

exports.getGraph = factory.getOne(Graph, {
  populateOptions: [{ path: 'nodes' }, { path: 'edges' }],
});
exports.deleteGraph = factory.deleteOne(Graph);

// User Based Controllers
exports.getAllMyGraphs = factory.getAllMy(Graph, {
  nestedParams: { problem: 'problemId' },
});
exports.createMyGraph = factory.createMyOne(Graph);

exports.getMyGraph = factory.getMyOne(Graph, {
  populateOptions: [{ path: 'nodes' }, { path: 'edges' }],
});
exports.updateMyGraph = factory.updateMyOne(Graph);
