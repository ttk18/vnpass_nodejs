const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 11,
      maxLength: 12,
    },
    eid: {
      type: String,
      unique: true,
      trim: true,
      minlength: 9,
      maxLength: 12,
    },
    eidIssuedDate: {
      type: Date,
    },
    eidIssuedBy: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    placeOfOrigin: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    msisdn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 11,
      maxLength: 11,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    firebaseUid: {
      type: String,
      required: true,
      trim: true,
    },
    fcmToken: {
      type: String,
      trim: true,
    },
    deviceUid: {
      type: String,
      trim: true,
    },
    deviceName: {
      type: String,
      trim: true,
    },
    devicePlatform: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isKyc: {
      type: Boolean,
      default: false,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if phone number is taken
 * @param {string} phone - The user's phone
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
  const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if phone number is taken
 * @param {string} msisdn - The user's msisdn
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isMsisdnTaken = async function (msisdn, excludeUserId) {
  const user = await this.findOne({ msisdn, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
