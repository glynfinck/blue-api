const factory = require('./handlerFactory');
const Node = require('../models/nodeModel');

exports.getAllNodes = factory.getAll(Node, { graph: 'graphId' });
exports.createNode = factory.createOne(Node);

exports.getNode = factory.getOne(Node);
exports.updateNode = factory.updateOne(Node);
exports.deleteNode = factory.deleteOne(Node);
