import mongoose from 'mongoose';
import Address from './address';

/**
 * Clinic Schema
 */
const ClinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  addresses: [Address],
  contact: {
    telephone: { type: String, required: true, trim: true },
    email: { type: String, trim: true }
  },
  times: [
    {
      from_hour: { type: Number, min: 0, max: 23 },
      from_minute: { type: Number, min: 0, max: 59 },
      to: { type: Number, min: 0, max: 23 },
      to_minute: { type: Number, min: 0, max: 59 }
    }
  ],
  website: { type: String, trim: true },
  media: {
    avatar: { type: String, trim: true },
    banner: { type: String, trim: true },
    gallery: [
      { type: String, trum: true }
    ]
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
ClinicSchema.method({});

/**
 * Statics
 */
ClinicSchema.statics = {
  /**
   * List clinics in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of clinics to be skipped.
   * @param {number} limit - Limit number of clinics to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .execAsync();
  }
};

/**
 * @typedef Clinic
 */
export default mongoose.model('Clinic', ClinicSchema);
