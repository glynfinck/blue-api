const mongoose = require('mongoose');
const Graph = require('../models/graphModel');
const Node = require('../models/nodeModel');

const getNodeValidation = (name1, name2) => {
  return [
    {
      validator: function(val) {
        return val.toString() !== this[name2].toString();
      },
      message: `The ${name1} node must be different from the ${name2} node`
    },
    {
      validator: async function(val) {
        const node = await Node.findById(val);
        return !!node;
      },
      message: `This ${name1} node does not exist`
    },
    {
      validator: async function(val) {
        // 1) Get node
        const node = await Node.findById(val);
        if (!node) {
          return true;
        }
        const graphId = node.graph;

        // 2) Check if the graph for the node is the same as the current edge
        return graphId.toString() === this.graph.toString();
      },
      message: `The graph for the ${name1} node must be the same this edge`
    }
  ];
};

// const validateSourceNode = async function(val) {
//   // 1) Check if the source node is equal to the target node
//   if (val.toString() === this.target.toString()) {
//     return false;
//   }

//   // 2) Get the node object for the inputed id and check if it exists
//   const node = await Node.findById(val);
//   if (!node) {
//     return false;
//   }
//   const graphId = node.graph;

//   // 3) Check if the graph for the node is the same as the current edge
//   return graphId.toString() === this.graph.toString();
// };

// const validateTargetNode = async function(val) {
//   // 1) Check if the source node is equal to the target node
//   if (val.toString() === this.source.toString()) {
//     return false;
//   }

//   // 2) Get the node object for the inputed id and check if it exists
//   const node = await Node.findById(val);
//   if (!node) {
//     return false;
//   }
//   const graphId = node.graph;

//   // 3) Check if the graph for the node is the same as the current edge
//   return graphId.toString() === this.graph.toString();
// };

const edgeSchema = new mongoose.Schema(
  {
    graph: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'An edge must belong to a graph'],
      immutable: [true, "An edge's graph cannot be changed"]
    },
    user: {
      type: String,
      immutable: [true, "An edge's user cannot be changed"]
    },
    source: {
      type: mongoose.Schema.ObjectId,
      ref: 'Node',
      required: [true, 'An edge must have a source node'],
      validate: getNodeValidation('source', 'target')
    },
    target: {
      type: mongoose.Schema.ObjectId,
      ref: 'Node',
      required: [true, 'An edge must have a target node'],
      validate: getNodeValidation('target', 'source')
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

edgeSchema.index({ graph: 1, source: 1, target: 1 }, { unique: true });

edgeSchema.pre('save', async function(next) {
  const graph = await Graph.findById(this.graph);
  this.user = graph.user;
  next();
});

const Edge = mongoose.model('Edge', edgeSchema);

module.exports = Edge;
