const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, 'A firebase uid is required'],
    },
    email: { type: String, required: [true, 'A user must have an email'] },
    role: {
      type: String,
      enum: ['admin', 'user', 'premium-user'],
      default: 'user',
    },
    active: { type: Boolean, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userDataSchema.index({ uid: 1, email: 1 }, { unique: true });

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;
