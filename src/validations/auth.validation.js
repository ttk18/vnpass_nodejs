const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    domain: Joi.string().required(),
    displayName: Joi.string().required(),
    phoneNumber: Joi.string().min(11).max(12).trim().required(),
    eid: Joi.string().min(9).max(12).trim(),
    eidIssuedDate: Joi.date().iso(),
    eidIssuedBy: Joi.string(),
    dateOfBirth: Joi.date().iso(),
    placeOfOrigin: Joi.string().optional().allow(null, ''),
    gender: Joi.string().optional().allow(null, ''),
    email: Joi.string().optional().allow(null, ''),
    avatarUrl: Joi.string().optional().allow(null, ''),
    msisdn: Joi.string().min(11).max(11).trim().required(),
    fcmToken: Joi.string().required(),
    deviceUid: Joi.string().allow(null, ''),
    deviceName: Joi.string().optional().allow(null, ''),
    devicePlatform: Joi.string().optional().allow(null, ''),
    isKyc: Joi.boolean(),
  }),
};

const getPhoneNumber = {
  query: Joi.object().keys({
    msisdn: Joi.string().min(11).max(11).trim(),
  }),
};

const login = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().min(11).max(12).trim().required(),
    msisdn: Joi.string().min(11).max(11).trim().required(),
    firebaseUid: Joi.string().required(),
    fcmToken: Joi.string(),
  }),
};

const logout = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  getPhoneNumber,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
