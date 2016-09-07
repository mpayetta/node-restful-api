import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Regex from '../helpers/Regex';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  fullname: { type: String, trim: true },
  password: { type: String, required: true, trim: true },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: [Regex.Mobile, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.'],
    trim: true
  },
  refresh: { type: String, trim: true }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (hashErr, hash) => {
      if (hashErr) return next(hashErr);

      user.password = hash;
      next();
    });
  });
});

/**
 * Methods
 */
UserSchema.methods.comparePassword = function (toCompare, done) {
  bcrypt.compare(toCompare, this.password, (err, isMatch) => {
    if (err) done(err);
    else done(err, isMatch);
  });
};

/**
 * Statics
 */
UserSchema.statics = {

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
