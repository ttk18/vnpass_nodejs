const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const simSchema = mongoose.Schema(
  {
    prefix: {
      type: String,
      trim: true,
    },
    msisdn: {
      type: String,
      required: true,
      trim: true,
    },
    phoneRegex: {
      type: String,
      trim: true,
    },
    cts: {
      type: String,
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
    },
    telecomStatus: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
    },
    assignedUser: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
simSchema.plugin(toJSON);
simSchema.plugin(paginate);

/**
 * Check if the sim is already created for the phone number.
 * @param {string} msisdn - The phone msisdn.
 */
simSchema.statics.isSimCreated = async function (msisdn) {
  const sim = await this.findOne({ msisdn });
  return !!sim;
};

/**
 * @typedef Sim
 */
const Sim = mongoose.model('Sim', simSchema);

module.exports = Sim;
