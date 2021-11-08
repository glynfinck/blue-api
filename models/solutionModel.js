const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, 'A solution must belong to a user'],
      immutable: [true, "A solution's user cannot be changed"],
    },
    problem: {
      type: mongoose.Schema.ObjectId,
      ref: 'Problem',
      required: [true, 'A solution must belong to a problem'],
      immutable: [true, "A solution's problem cannot be changed"],
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
