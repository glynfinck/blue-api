const mongoose = require('mongoose');

const graphSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, 'A graph must belong to a user'],
    },
    problem: {
      type: mongoose.Schema.ObjectId,
      ref: 'Problem',
      required: [true, 'A graph must belong to a problem'],
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
