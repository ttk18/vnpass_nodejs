const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOtp = {
  body: Joi.object().keys({
    phoneNumber: Joi.string().required().min(11).max(11).trim(),
    otp: Joi.string().optional().allow(null, ''),
    provider: Joi.string().optional().allow(null, ''),
    status: Joi.number().integer(),
    assignedUser: Joi.string().optional(),
  }),
};

const getOtps = {
  query: Joi.object().keys({
    phoneNumber: Joi.string().min(11).max(11).trim(),
    provider: Joi.string(),
    status: Joi.number().integer(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    start: Joi.string(),
    end: Joi.string(),
  }),
};

const getOtp = {
  params: Joi.object().keys({
    otpId: Joi.string().custom(objectId),
  }),
};

const updateOtp = {
  params: Joi.object().keys({
    otpId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      phoneNumber: Joi.string().required().min(11).max(11).trim(),
      otp: Joi.string().optional().allow(null, ''),
      provider: Joi.string().optional().allow(null, ''),
      status: Joi.number().integer().min(2).max(4),
      assignedUser: Joi.string().optional(),
    })
    .min(1),
};

const updateOtpStatus = {
  body: Joi.object()
    .keys({
      phoneNumber: Joi.string().required().min(11).max(11).trim(),
      otp: Joi.string().optional().allow(null, ''),
      provider: Joi.string().optional().allow(null, ''),
      status: Joi.number().integer().min(2).max(4),
    })
    .min(1),
};

const deleteOtp = {
  params: Joi.object().keys({
    otpId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOtp,
  getOtps,
  getOtp,
  updateOtp,
  updateOtpStatus,
  deleteOtp,
};
