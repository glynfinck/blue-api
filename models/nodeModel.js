const mongoose = require('mongoose');
const Graph = require('../models/graphModel');
// const catchAsync = require('../utils/catchAsync');

const nodeSchema = new mongoose.Schema(
  {
    graph: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'A node must belong to a graph'],
      validate: [
        {
          validator: async function(val) {
            return !!(await Graph.findById(val));
          },
          message: 'The graph with this id does not exist'
        }
      ],
      immutable: [true, "A node's graph cannot be changed"]
    },
    user: {
      type: String,
      immutable: [true, "A node's user cannot be changed"]
    },
    xLocation: {
      type: Number,
      required: [true, 'A Node must have a location in x']
    },
    yLocation: {
      type: Number,
      required: [true, 'A Node must have a location in y']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add user to node model based on the graph id inputted
nodeSchema.pre('save', async function(next) {
  const graph = await Graph.findById(this.graph);
  this.user = graph.user;
  next();
});

const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;
