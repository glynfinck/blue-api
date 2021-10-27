const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema(
  {
    graph: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'A node must belong to a graph'],
    },
    xLocation: {
      type: Number,
      required: [true, 'A Node must have a location in x'],
    },
    yLocation: {
      type: Number,
      required: [true, 'A Node must have a location in y'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;
