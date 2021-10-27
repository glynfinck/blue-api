const mongoose = require('mongoose');
const Node = require('../models/nodeModel');

const validateSourceNode = async function (val) {
  // 1) Check if the source node is equal to the target node
  if (val.toString() === this.target.toString()) {
    return false;
  }

  // 2) Get the node object for the inputed id and check if it exists
  const node = await Node.findById(val);
  if (!node) {
    return false;
  }
  const graphId = node.graph;

  console.log(graphId);
  console.log(this.graph);
  console.log(graphId === this.graph);

  // 3) Check if the graph for the node is the same as the current edge
  return graphId.toString() === this.graph.toString();
};

const validateTargetNode = async function (val) {
  // 1) Check if the source node is equal to the target node
  if (val.toString() === this.source.toString()) {
    return false;
  }

  // 2) Get the node object for the inputed id and check if it exists
  const node = await Node.findById(val);
  if (!node) {
    return false;
  }
  const graphId = node.graph;

  // 3) Check if the graph for the node is the same as the current edge
  return graphId.toString() === this.graph.toString();
};

const edgeSchema = new mongoose.Schema(
  {
    graph: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'An edge must belong to a graph'],
    },
    source: {
      type: mongoose.Schema.ObjectId,
      ref: 'Node',
      required: [true, 'An edge must have a source node'],
      validate: {
        validator: validateSourceNode,
        message:
          'Source node must be in the same graph as this edge and must be different from the target node',
      },
    },
    target: {
      type: mongoose.Schema.ObjectId,
      ref: 'Node',
      required: [true, 'An edge must have a target node'],
      validate: {
        validator: validateTargetNode,
        message:
          'Target node must be in the same graph as this edge and must be different from the source node',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Edge = mongoose.model('Edge', edgeSchema);

module.exports = Edge;
