const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSim = {
  body: Joi.object().keys({
    msisdn: Joi.string().required().min(11).max(11).trim(),
    brandType: Joi.string().optional(),
    assignedUser: Joi.string().custom(objectId).optional().allow(null, ''),
    status: Joi.number().integer().optional(),
  }),
};

const getSimPrefixes = {
  query: Joi.object().keys({
    domain: Joi.string().trim().required(),
  }),
};

const getSims = {
  query: Joi.object().keys({
    domain: Joi.string().trim().required(),
    prefix: Joi.string().min(3).max(5).trim(),
    msisdn: Joi.string().min(1).max(11).trim(),
    phoneRegex: Joi.string().trim(),
    cts: Joi.string().trim(),
    status: Joi.string().trim(),
    telecomStatus: Joi.string().trim(),
    assignedUser: Joi.string(),
    position: Joi.string().trim(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const searchSims = {
  query: Joi.object().keys({
    domain: Joi.string().trim().required(),
    msisdn: Joi.string().trim(),
    position: Joi.string().trim(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSim = {
  params: Joi.object().keys({
    simId: Joi.string().custom(objectId),
  }),
};

const updateSim = {
  params: Joi.object().keys({
    simId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    prefix: Joi.string().min(3).max(5).trim(),
    msisdn: Joi.string().min(11).max(11).trim(),
    phoneRegex: Joi.string().trim(),
    cts: Joi.string().trim(),
    domain: Joi.string().trim(),
    status: Joi.string().trim(),
    telecomStatus: Joi.string().trim(),
    price: Joi.number().default(0),
    assignedUser: Joi.string(),
  }),
};

const deleteSim = {
  params: Joi.object().keys({
    simId: Joi.string().custom(objectId),
  }),
};

// endregion

module.exports = {
  createSim,
  getSimPrefixes,
  getSims,
  searchSims,
  getSim,
  updateSim,
  deleteSim,
};
