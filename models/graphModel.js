const mongoose = require('mongoose');
const Problem = require('../models/problemModel');

const graphSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, 'A graph must belong to a user'],
      immutable: [true, "A graph's user cannot be changed"],
    },
    problem: {
      type: mongoose.Schema.ObjectId,
      ref: 'Problem',
      required: [true, 'A graph must belong to a problem'],
      validate: {
        validator: async function (val) {
          return !!(await Problem.findById(val));
        },
        message: 'The problem with this id does not exist',
      },
      immutable: [true, "A graph's problem cannot be changed"],
    },
    directed: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

graphSchema.index({ user: 1, problem: 1 }, { unique: true });

// Virtual Populate
graphSchema.virtual('nodes', {
  ref: 'Node',
  foreignField: 'graph',
  localField: '_id',
});
graphSchema.virtual('edges', {
  ref: 'Edge',
  foreignField: 'graph',
  localField: '_id',
});

const Graph = mongoose.model('Graph', graphSchema);

module.exports = Graph;
