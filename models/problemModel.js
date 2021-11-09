const mongoose = require('mongoose');
const slugify = require('slugify');

const problemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true
    },
    solutionCode: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    slug: { type: String, unique: true }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

problemSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
