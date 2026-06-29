const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    tokenNumber: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    symptoms: { type: String, required: true },
    priority: {
      type: String,
      enum: ['emergency', 'urgent', 'normal'],
      default: 'normal',
    },
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'completed', 'skipped'],
      default: 'waiting',
    },
    phone: { type: String },
    estimatedWait: { type: Number, default: 0 }, // minutes
    calledAt: { type: Date },
    completedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

// Auto-increment token number
patientSchema.pre('save', async function (next) {
  if (this.isNew) {
    const last = await this.constructor.findOne().sort({ tokenNumber: -1 });
    this.tokenNumber = last ? last.tokenNumber + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
