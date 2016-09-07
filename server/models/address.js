import mongoose from 'mongoose';

export default new mongoose.Schema({
  address_1: { type: String, required: true, trim: true },
  address_2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  zip_code: { type: String, trim: true },
  country: { type: String, trim: true },
  type: { type: String, trim: true, default: 'PRIMARY', enum: ['PRIMARY', 'BRANCH'] }
});
