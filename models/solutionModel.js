const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, 'A solution must belong to a user'],
    },
    problem: {
      type: mongoose.Schema.ObjectId,
      ref: 'Problem',
      required: [true, 'A solution must belong to a problem'],
    },
    solutionCode: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

solutionSchema.index({ user: 1, problem: 1 }, { unique: true });

const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;
